using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ImageCorner.Models
{
    public class CreateAlbumViewModal
    {
        public string UserId { get; set; }
        public ICollection<Image> Images { get; set; }
    }
}