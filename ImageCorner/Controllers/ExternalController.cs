using ImageCorner.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace ImageCorner.Controllers
{
    public class ExternalController : Controller
    {
        private ApplicationDbContext _context;

        public ExternalController()
        {
            _context = new ApplicationDbContext();
        }

        // GET: External
        public ActionResult Index(string url, string type)
        {
            if (String.IsNullOrEmpty(url) || String.IsNullOrEmpty(type))
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

            Image image;
            Album album;

            switch(type)
            {
                case "album":
                    album = _context.Albums.FirstOrDefault(m => m.Url == url);

                    if (album != null)
                        return View(new ExternalViewModel
                        {
                            Album = album,
                            Type = "album"
                        });
                    break;
                case "image":
                    image = _context.Images.FirstOrDefault(m => m.Url == url);

                    if (image != null)
                        return View(new ExternalViewModel
                        {
                            Image = image,
                            Type = "image"
                        });
                    break;
            }

            return new HttpStatusCodeResult(HttpStatusCode.NotFound);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
                _context.Dispose();

            base.Dispose(disposing);
        }
    }
}