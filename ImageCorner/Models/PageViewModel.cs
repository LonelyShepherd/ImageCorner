using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ImageCorner.Models
{
    public class LayoutViewModel<E, T> : LayoutViewModel<T>
    {
        public LayoutViewModel(E pageModel, T layoutModel) : base (layoutModel)
        {
            this.PageModel = pageModel;
        }

        public E PageModel { get; }
    }
}