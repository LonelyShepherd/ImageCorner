using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ImageCorner.Startup))]
namespace ImageCorner
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
