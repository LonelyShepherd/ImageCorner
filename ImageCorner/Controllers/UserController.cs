using ImageCorner.Common;
using ImageCorner.Models;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace ImageCorner.Controllers
{
    public class UserController : Controller
    {
        private ApplicationDbContext _context;

        public UserController()
        {
            _context = new ApplicationDbContext();
        }

        [Authorize]
        public ActionResult UploadImages()
        {
            return PartialView("~/Views/Shared/_Upload.cshtml");
        }

        [Authorize]
        public ActionResult Share(int id, string type)
        {
            Image image;
            Album album;
            ShareViewModel model;

            var user = _context.Users.Find(User.Identity.GetUserId());

            if (type == "image")
            {
                image = user.Images.FirstOrDefault(m => m.Id == id);

                model = new ShareViewModel
                {
                    Id = image.Id,
                    Name = image.Name,
                    Url = image.Url != null ? Request.Url.Scheme + "://" + Request.Url.Authority + Request.ApplicationPath.TrimEnd('/') + "/" + "External?url=" + image.Url + "&type=image" : ""
                };
            }
            else if (type == "album")
            {
                album = user.Albums.FirstOrDefault(m => m.Id == id);

                model = new ShareViewModel
                {
                    Id = album.Id,
                    Name = album.Name,
                    Url = album.Url != null ? Request.Url.Scheme + "://" + Request.Url.Authority + Request.ApplicationPath.TrimEnd('/') + "/" + "External?url=" + album.Url + "&type=album" : ""
                };
            }
            else return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

            return PartialView("~/Views/Shared/_Share.cshtml", model);

        }

        [Authorize]
        public ActionResult NewAlbum()
        {
            var userId = User.Identity.GetUserId();
            var user = _context.Users.FirstOrDefault(m => m.Id == userId);

            var model = new CreateAlbumViewModal
            {
                UserId = userId,
                Images = user.Images.Where(m => m.HasAlbum == false).ToList()
            };

            return PartialView("~/Views/Shared/_NewAlbum.cshtml", model);
        }

        // GET: /User
        [Authorize]
        public ActionResult Index()
        {
            var userId = User.Identity.GetUserId();
            var model = _context.Users.FirstOrDefault(m => m.Id == userId);

            return View(new LayoutViewModel<ICollection<Image>, ApplicationUser>(model.Images
                .OrderByDescending(m => m.Posted)
                .Where(m => m.Posted <= m.Posted.AddDays(+30))
                .ToList(), 
                model));
        }

        // GET: /User/MyCorner
        [Authorize]
        public ActionResult MyCorner()
        {
            var userId = User.Identity.GetUserId();
            var model = _context.Users.FirstOrDefault(m => m.Id == userId);

            return View(new LayoutViewModel<ICollection<Image>, ApplicationUser>(model.Images
                .OrderByDescending(m => m.Posted)
                .ToList(),
                model));
        }

        // GET: /User/Showcase
        [Authorize]
        public ActionResult Showcase()
        {
            var userId = User.Identity.GetUserId();
            var user = _context.Users.FirstOrDefault(m => m.Id == userId);
            var images = _context.Images
                .OrderByDescending(m => m.Posted)
                .Where(m => m.Type == ViewMode.Public)
                .ToList();

            return View(new LayoutViewModel<ICollection<Image>, ApplicationUser>(images, user));
        }

        // POST: /User/Upload
        [HttpPost]
        [Authorize]
        public ActionResult Upload()
        {
            var uploaded = new List<ImageViewModel>();
            var userId = User.Identity.GetUserId();
            var user = _context.Users.Find(userId);
            var images = user.Images;
            var mode = ViewMode.IsValid(Request.Form["mode"]) ? Request.Form["mode"] : ViewMode.Public;

            try
            {
                Directory.CreateDirectory(Path.Combine(Server.MapPath("~/Uploads/"), userId));

                for (int i = 0; i < Request.Files.Count; i++)
                {
                    var file = Request.Files[i];
                    var fileName = file.FileName;
                    var imageExists = images.FirstOrDefault(m => m.Name == fileName);
                    var path = Path.Combine(Server.MapPath("~/Uploads/"), User.Identity.GetUserId(), fileName);

                    if (imageExists == null)
                    {
                        var Image = new Image
                        {
                            Name = fileName,
                            Type = mode,
                            Posted = DateTime.Now,
                            HasAlbum = false
                        };

                        _context.Images.Add(Image);
                        user.Images.Add(Image);

                        file.SaveAs(path);

                        _context.SaveChanges();

                        uploaded.Add(new ImageViewModel {
                            Id = Image.Id,
                            Name = fileName,
                            Posted = Image.Posted.ToShortTimeString() + "-" + Image.Posted.ToShortDateString(),
                            OwnerId = Image.ApplicationUserId,
                            Mode = Image.Type
                        });
                    }
                }                
            }
            catch(Exception e) { }

            return Json(new { files = uploaded.ToArray() });
        }

        [HttpPost]
        [Authorize]
        public ActionResult UploadAlbum()
        {
            var userId = User.Identity.GetUserId();
            var user = _context.Users.Find(userId);
            var images = user.Images;
            var mode = ViewMode.IsValid(Request.Form["mode"]) ? Request.Form["mode"] : ViewMode.Public;
            var uploaded = new List<ImageViewModel>();
            var temp = new List<Image>();
            Album album = new Album();

            try
            {
                for (int i = 0; i < Request.Files.Count; i++)
                {
                    var file = Request.Files[i];
                    var fileName = file.FileName;
                    var imageExists = images.FirstOrDefault(m => m.Name == fileName);
                    var path = Path.Combine(Server.MapPath("~/Uploads/"), User.Identity.GetUserId(), fileName);

                    if (imageExists == null)
                    {
                        var Image = new Image
                        {
                            Name = fileName,
                            Type = ViewMode.Private,
                            Posted = DateTime.Now,
                            HasAlbum = true
                        };

                        temp.Add(Image);
                        _context.Images.Add(Image);
                        user.Images.Add(Image);

                        _context.SaveChanges();

                        uploaded.Add(new ImageViewModel
                        {
                            Id = Image.Id,
                            Name = fileName,
                            Posted = Image.Posted.ToShortTimeString() + "-" + Image.Posted.ToShortDateString(),
                            OwnerId = userId,
                            Mode = Image.Type
                        });

                        file.SaveAs(path);                        
                    }
                }

                album.Name = Request.Form["albumName"];
                album.Images = temp;
                album.Type = mode;

                _context.Albums.Add(album);
                user.Albums.Add(album);
            }
            catch (Exception e) { }

            _context.SaveChanges();

            return Json(new {
                Images = uploaded.ToArray(),
                ImageCount = uploaded.Count,
                Id = album.Id,
                Name = album.Name,
                Mode = album.Type
            });
        }

        // POST: /User/Remove
        [HttpPost]
        [Authorize]
        public ActionResult Remove(int? id, string type)
        {
            if (id == null)
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

            Image image;
            Album album;

            var userId = User.Identity.GetUserId();
            var user = _context.Users.Find(userId);

            if (type == "image")
            {
                image = _context.Images.FirstOrDefault(m => m.Id == id);

                if (image == null)
                    return HttpNotFound();

                var removedId = image.Id;

                _context.Images.Remove(image);
                user.Images.Remove(image);

                var path = Path.Combine(Server.MapPath("~/Uploads/"), userId, image.Name);

                if (System.IO.File.Exists(path))
                    System.IO.File.Delete(path);

                _context.SaveChanges();

                return Json(removedId);
            }
            else if (type == "album")
            {
                var removed = new List<int>();

                album = _context.Albums.FirstOrDefault(m => m.Id == id);

                if (album == null)
                    return HttpNotFound();

                foreach(var item in album.Images.ToList())
                {
                    removed.Add(item.Id);
                    _context.Images.Remove(item);

                    var path = Path.Combine(Server.MapPath("~/Uploads/"), userId, item.Name);

                    if (System.IO.File.Exists(path))
                        System.IO.File.Delete(path);
                }
                _context.Albums.Remove(album);
                user.Albums.Remove(album);

                _context.SaveChanges();

                return Json(removed.ToArray());
            }

            return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        }

        [Authorize]
        public ActionResult MyAlbum(int? id)
        {
            if (id == null)
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

            var userId = User.Identity.GetUserId();
            var user = _context.Users.Find(userId);
            var album = user.Albums.FirstOrDefault(m => m.Id == id);

            if (album == null)
                return new HttpStatusCodeResult(HttpStatusCode.Unauthorized);

            return View(new LayoutViewModel<Album, ApplicationUser>(album, user));
        }

        [Authorize]
        public ActionResult Album(int? id)
        {
            if (id == null)
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

            var album = _context.Albums.FirstOrDefault(m => m.Id == id);

            if(album == null)
                return new HttpStatusCodeResult(HttpStatusCode.NotFound);

            if (album.Type != ViewMode.Public)
                return new HttpStatusCodeResult(HttpStatusCode.Unauthorized);

            var userId = User.Identity.GetUserId();
            var user = _context.Users.Find(userId);

            return View(new LayoutViewModel<Album, ApplicationUser>(album, user));
        }

        // GET: /User/Preview?id:int
        [Authorize]
        public ActionResult Preview(int? id)
        {
            if (id == null)
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

            var user = _context.Users.Find(User.Identity.GetUserId());
            var image = _context.Images.FirstOrDefault(m => m.Id == id);

            if (image == null)
                return new HttpStatusCodeResult(HttpStatusCode.NotFound);

            return View(new LayoutViewModel<Image, ApplicationUser>(image, user));
        }

        [HttpPost]
        [Authorize]
        public ActionResult ChangeMode(int? id, string type)
        {
            if (id == null)
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

            Image image;
            Album album;

            if(type == "image")
            {
                image = _context.Images.FirstOrDefault(m => m.Id == id);

                if (image == null)
                    return HttpNotFound();

                image.Type = image.Type == ViewMode.Public ? ViewMode.Private : ViewMode.Public;
            }
            else if(type == "album")
            {
                album = _context.Albums.FirstOrDefault(m => m.Id == id);

                if (album == null)
                    return HttpNotFound();

                album.Type = album.Type == ViewMode.Public ? ViewMode.Private : ViewMode.Public;
            }

            _context.SaveChanges();

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        // POST: /User/Link?id:int
        [Authorize]
        [HttpPost]
        public ActionResult Link(int? id, string type)
        {
            if (id == null)
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

            Image image;
            Album album;

            if(type == "image")
            {
                image = _context.Images.FirstOrDefault(m => m.Id == id);

                if (image == null)
                    return HttpNotFound();

                if (image.Url == null)
                {
                    var url = String.Join("", Guid.NewGuid().ToString().Split(new char[] { '-' }, StringSplitOptions.None));

                    image.Url = url;
                    _context.SaveChanges();
                }

                return Json(Request.Url.Scheme + "://" + Request.Url.Authority + Request.ApplicationPath.TrimEnd('/') + "/" + "External?url=" + image.Url + "&type=image");
            }
            else if(type == "album")
            {
                album = _context.Albums.FirstOrDefault(m => m.Id == id);

                if (album == null)
                    return HttpNotFound();

                if (album.Url == null)
                {
                    var url = String.Join("", Guid.NewGuid().ToString().Split(new char[] { '-' }, StringSplitOptions.None));

                    album.Url = url;
                    _context.SaveChanges();
                }

                return Json(Request.Url.Scheme + "://" + Request.Url.Authority + Request.ApplicationPath.TrimEnd('/') + "/" + "External?url=" + album.Url + "&type=album");
            }

            return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        }

        [Authorize]
        public ActionResult Albums()
        {
            var userId = User.Identity.GetUserId();
            var user = _context.Users.Find(userId);

            return View(new LayoutViewModel<ICollection<Album>, ApplicationUser>(user.Albums, user));
        }

        [HttpPost]
        [Authorize]
        public ActionResult CreateAlbum(string name, string mode, string selected)
        {
            
            var userId = User.Identity.GetUserId();
            var user = _context.Users.Find(userId);
            var selectedArray = selected.Split(',').Select(x => Int32.Parse(x)).ToArray();

            if (selectedArray.Length == 0)
                return new HttpStatusCodeResult(HttpStatusCode.Forbidden);

            var album = new Album
            {
                Name = !String.IsNullOrEmpty(name) ? name : "Unnamed",
                Type = ViewMode.IsValid(mode) ? mode : ViewMode.Public
            };
            var images = new List<Image>();

            foreach(var index in selectedArray)
            {
                var image = user.Images.FirstOrDefault(m => m.Id == index);

                image.HasAlbum = true;
                images.Add(image);
            }

            album.Images = images;

            _context.Albums.Add(album);
            user.Albums.Add(album);

            _context.SaveChanges();

            return Json(new {
                Id = album.Id,
                Name = album.Name,
                ImageCount = album.Images.Count,
                Mode = album.Type
            });
        }

        [Authorize]
        public JsonResult GetImages()
        {
            var userId = User.Identity.GetUserId();
            var user = _context.Users.Find(userId);

            return Json(user.Images);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
                _context.Dispose();

            base.Dispose(disposing);
        }
    }
}