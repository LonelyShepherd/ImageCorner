using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ImageCorner.Models
{
    public class ImageViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string OwnerId { get; set; }
        public string Posted { get; set; }
        public string Mode { get; set; }
    }
}