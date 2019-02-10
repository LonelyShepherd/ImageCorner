using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNet.Identity;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace ImageCorner.Models
{
    public class Image
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public DateTime Posted { get; set; }
        public string Url { get; set; }
        public bool HasAlbum { get; set; }

        public string ApplicationUserId { get; set; }
        [ForeignKey("ApplicationUserId")]
        public virtual ApplicationUser ApplicationUser { get; set; }
    }
}