using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace ImageCorner.Models
{
    public class Album
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Url { get; set; }

        public string ApplicationUserId { get; set; }
        [ForeignKey("ApplicationUserId")]
        public virtual ApplicationUser ApplicationUser { get; set; }

        public virtual ICollection<Image> Images { get; set; }
    }
}