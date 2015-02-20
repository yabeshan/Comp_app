
var pagingHelper = (function () {

    // public api
    return {
        // returns { number: [integer], isDots [boolean] }
        getPageLinks: function (totalPages, currentPage) {
            var buttons = [];
            // how many pages to display before and after the current page
            var x = 2;

            // if we just have one page, show nothing
            if (totalPages == 1) {
                return;
            }

            // if we are not at the first page, show the "Prev" button
            if (currentPage > 1) {
                //console.log("Prev");
            }

            // always display the first page
            if (currentPage == 1) {
                //console.log("    [1]");
                buttons.push({ number: 1, isDots: false });
            } else {
                //console.log("    1");
                buttons.push({ number: 1, isDots: false });
            }

            // besides the first and last page, how many pages do we need to display?
            var how_many_times = 2 * (x + 1);

            // we use the left and right to restrict the range that we need to display
            var left = Math.max(2, currentPage - 2 * x - 1);
            var right = Math.min(totalPages - 1, currentPage + 2 * x + 1);

            // the upper range restricted by left and right are more loosely than we need,
            // so we further restrict this range we need to display
            while ((right - left) > (2 * x)) {
                if ((currentPage - left) < (right - currentPage)) {
                    right--;
                    right = right < currentPage ? currentPage : right;
                } else {
                    left++;
                    left = left > currentPage ? currentPage : left;
                }
            }

            // do we need display the left "..."
            if (left >= 3) {
                //console.log("    ...("+ (left - (2 * x)) +")");
                buttons.push({ number: left - (2 * x), isDots: true });
            }

            // now display the middle pages, we display how_many_times pages from page left
            for (var i = 1, out = left; i <= how_many_times; i++, out++) {
                // there are some pages we need not to display
                if (out > right) {
                    continue;
                }

                // display the actual page
                if (out == currentPage) {
                    //console.log("    [" + out + "]");
                    buttons.push({ number: out, isDots: false });
                } else {
                    //console.log("    " + out);
                    buttons.push({ number: out, isDots: false });
                }
            }

            // do we need the right "..."
            if (totalPages - right >= 2) {
                //console.log("    ...("+ (right +1) +")");
                buttons.push({ number: right + 1, isDots: true });
            }

            // always display the last page
            if (currentPage == totalPages) {
                //console.log("    [" + totalPages + "]");
                buttons.push({ number: totalPages, isDots: false });
            } else {
                //console.log("    " + totalPages);
                buttons.push({ number: totalPages, isDots: false });
            }

            // if we are not at the last page, then display the "Next" button
            if (currentPage < totalPages) {
                //console.log("    Next");
            }
            //console.log('');
            return buttons;
        },        
        getPagesCount: function (totalRecordCount, recordsPerPage) {
            if (totalRecordCount % recordsPerPage > 0)
                return ((totalRecordCount - (totalRecordCount % recordsPerPage)) / recordsPerPage) + 1;
            else
                return totalRecordCount / recordsPerPage;
        },
        stylyzePageButtons : function (data, pageNo) {

            if (data) {
                for(var i=0; i < data.length; i++) 
                {
                    if (data[i].number == pageNo)
                        data[i].current = true;
                    else
                        data[i].current = false;
                }
            }

            return data;
        }

    };

}());
