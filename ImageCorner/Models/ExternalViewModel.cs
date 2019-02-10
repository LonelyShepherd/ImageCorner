using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ImageCorner.Models
{
    public class ExternalViewModel
    {
        public Album Album { get; set; }
        public Image Image { get; set; }
        public string Type { get; set; }
    }
}