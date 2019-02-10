using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace ImageCorner.Common
{
    public static class HttpPostedFileBaseExtensions
    {
        public static bool IsImage(string fileName)
        {
            bool val = true;
            try
            {
                System.Drawing.Image img = System.Drawing.Image.FromFile(fileName);
                img.Dispose();
            }
            catch
            {
                val = false;
            }
            return val;
        }
    }
}