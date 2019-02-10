using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ImageCorner.Common
{
    public static class ViewMode
    { 
        public static string Public => "Public";
        public static string Private => "Private";

        public static bool IsValid(string mode)
        {
            return mode == Public || mode == Private;
        }
    }
}