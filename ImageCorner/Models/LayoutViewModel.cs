using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ImageCorner.Models
{
    public class LayoutViewModel<T>
    {
        public LayoutViewModel(T LayoutModel)
        {
            this.LayoutModel = LayoutModel;
        }

        public T LayoutModel { get; }
    }
}