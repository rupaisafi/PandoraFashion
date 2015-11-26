using ProductionPlan.Models;
using Microsoft.CSharp.RuntimeBinder;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Web;

namespace ProductionPlan.Helper
{
    public class IEnumerableData
    {
        public delegate IEnumerable<dynamic> MyFunction(string field1 = null, string field2 = null);
        public static IEnumerable<dynamic> OrderBy<T>(IEnumerable<dynamic> source, string property, bool isDescending)
        {
            return isDescending ? source.OrderByDescending(AccessorCache.GetAccessor<dynamic>(property)) : source.OrderBy(AccessorCache.GetAccessor<dynamic>(property));
        }
        public static IEnumerable<dynamic> Filter<T>(IEnumerable<object> source, string property, string value)
        {
            var attr = typeof(T).GetProperty(property);
            return source.Where(d => attr.GetValue(d, null).ToString().ToLower().Contains(value.ToLower()));
        }
        public static IEnumerable<dynamic> FilterNullable<T>(IEnumerable<object> source, string property, string value)
        {
            var attr = typeof(T).GetProperty(property);
            return source.Where(d => Check.NullableString(value, attr, d));
        }
        public static IEnumerable<dynamic> FilterDate<T>(IEnumerable<object> source, FilterModel filterModel)
        {
            var attr = typeof(T).GetProperty(filterModel.field);
            if (filterModel.StartDate != null && filterModel.EndDate != null)
            {
                return source.Where(d => Check.RangeDate(filterModel.StartDate.Value, filterModel.EndDate.Value, attr, d));
            }
            else if (filterModel.StartDate != null)
            {
                return source.Where(d => Check.StartDate(filterModel.StartDate.Value, attr, d));
            }
            else if (filterModel.EndDate != null)
            {
                return source.Where(d => Check.EndDate(filterModel.EndDate.Value, attr, d));
            }
            else
            {
                return source;
            }
        }
        private static IEnumerable<dynamic> SetOrdered<T>(Page page, IEnumerable<dynamic> source)
        {
            if (page.filter != null)
            {
                source = IEnumerableData.FilterByPage<T>(page, source);
            }
            if (page.SortBy != null)
            {
                source = IEnumerableData.OrderBy<T>(source, page.SortBy, page.IsDescending);
            }
            return source;
        }
        private static IEnumerable<dynamic> FilterByPage<T>(Page page, IEnumerable<dynamic> source)
        {
            foreach (var item in page.filter)
            {
                if (item != null)
                {
                    switch (item.Type)
                    {
                        case "Nullable":
                            source = IEnumerableData.FilterNullable<T>(source, item.field, item.value);
                            break;
                        case "DateTime":
                        case "Date":
                            source = IEnumerableData.FilterDate<T>(source, item);
                            break;
                        default:
                            source = IEnumerableData.Filter<T>(source, item.field, item.value);
                            break;
                    }
                }
            }
            return source;
        }
        public static Pagger<dynamic> Get<T>(Page page, IEnumerable<T> source)
        {
            var response = new Pagger<dynamic>();
            List<dynamic> data = SetOrdered<T>(page, (IEnumerable<dynamic>)source).ToList();
            response.Data = data.Skip((page.PageNumber - 1) * page.PageSize).Take(page.PageSize).ToList();
            response.PageNumber = page.PageNumber;
            response.PageSize = page.PageSize;
            response.Total = data.Count;
            return response;
        }
        public static ResponseJson GetPageResponse<T>(Page page, IEnumerable<T> source)
        {
            ResponseJson response = new ResponseJson();
            try
            {
                var pageData = new Pagger<dynamic>();
                //var ssss = source.ToList();
                List<dynamic> data = SetOrdered<T>(page, (IEnumerable<dynamic>)source).ToList();
                pageData.Data = data.Skip((page.PageNumber - 1) * page.PageSize).Take(page.PageSize).ToList();
                pageData.PageNumber = page.PageNumber;
                pageData.PageSize = page.PageSize;
                pageData.Total = data.Count;
                response.Data = pageData;
            }
            catch (Exception ex)
            {
                response.IsError = true;
                response.Id = -6;
            }
            return response;
        }
        public static Pagger<dynamic> Get<T>(Page page, string[] serverFilteringFields, MyFunction func)
        {
            string field1 = null, field2 = null;
            List<FilterModel> filter = new List<FilterModel>();
            List<FilterModel> oldFilter = page.filter;
            if (page.filter != null && serverFilteringFields != null)
            {
                foreach (var item in page.filter)
                {
                    if (item != null)
                    {
                        if (serverFilteringFields.Any(f => f == item.field))
                        {
                            if (field1 == null)
                            {
                                field1 = item.value;
                            }
                            else
                            {
                                field2 = item.value;
                            }
                        }
                        else
                        {
                            filter.Add(item);
                        }
                    }
                }
            }
            page.filter = filter;
            var response = Get<T>(page, (IEnumerable<T>)func(field1, field2));
            page.filter = oldFilter;
            return response;
        }
        private static class AccessorCache
        {
            private static readonly Hashtable accessors = new Hashtable();

            private static readonly Hashtable callSites = new Hashtable();

            private static CallSite<Func<CallSite, object, object>> GetCallSiteLocked(string name)
            {
                var callSite = (CallSite<Func<CallSite, object, object>>)callSites[name];
                if (callSite == null)
                {
                    callSites[name] = callSite = CallSite<Func<CallSite, object, object>>.Create(
                                Binder.GetMember(CSharpBinderFlags.None, name, typeof(AccessorCache),
                                new CSharpArgumentInfo[] { CSharpArgumentInfo.Create(CSharpArgumentInfoFlags.None, null) }));
                }
                return callSite;
            }

            internal static Func<T, object> GetAccessor<T>(string name)
            {
                Func<T, object> accessor = (Func<T, object>)accessors[name];
                if (accessor == null)
                {
                    lock (accessors)
                    {
                        accessor = (Func<T, object>)accessors[name];
                        if (accessor == null)
                        {
                            if (name.IndexOf('.') >= 0)
                            {
                                string[] props = name.Split('.');
                                CallSite<Func<CallSite, object, object>>[] arr = Array.ConvertAll(props, GetCallSiteLocked);
                                accessor = target =>
                                {
                                    object val = (object)target;
                                    for (int i = 0; i < arr.Length; i++)
                                    {
                                        var cs = arr[i];
                                        val = cs.Target(cs, val);
                                    }
                                    return val;
                                };
                            }
                            else
                            {
                                var callSite = GetCallSiteLocked(name);
                                accessor = target =>
                                {
                                    return callSite.Target(callSite, (object)target);
                                };
                            }
                            accessors[name] = accessor;
                        }
                    }
                }
                return accessor;
            }
        }

        //internal static object GetPageResponse<T1>(Page model, Func<IQueryable<Areas.Admin.DAL.GetZoneCoordinators_Result>> func)
        //{
        //    throw new NotImplementedException();
        //}
    }
    public class Check
    {
        public static bool NullableString(string value, System.Reflection.PropertyInfo attr, object d)
        {
            var data = attr.GetValue(d, null);
            if (data == null)
                return false;
            return data.ToString().ToLower().Contains(value.ToLower());
        }
        public static bool StartDate(DateTime value, System.Reflection.PropertyInfo attr, object d)
        {
            var data = (DateTime?)attr.GetValue(d, null);
            if (data == null)
                return false;
            return data >= value;
        }
        public static bool RangeDate(DateTime start, DateTime end, System.Reflection.PropertyInfo attr, object d)
        {
            var data = (DateTime?)attr.GetValue(d, null);
            if (data == null)
                return false;
            return start <= data && data <= end;
        }
        public static bool EndDate(DateTime value, System.Reflection.PropertyInfo attr, object d)
        {
            var data = (DateTime?)attr.GetValue(d, null);
            if (data == null)
                return false;
            return data <= value;
        }
        public static DateTime? stringToDate(string date)
        {
            if (date == null)
                return null;
            try
            {
                return DateTime.Parse(date);
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}