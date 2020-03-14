// $(function(){
//     stickyFooter();
//
//     $(window).scroll(stickyFooter).resize(stickyFooter);
// });
//
// function stickyFooter(){
//     let document_height = $(document).height(); // 문서 전체 높이
//     let document_scrollTop = $(document).scrollTop(); // 문서 전체 높이 중 스크롤 위치
//     let window_height = $(window).height(); // 창 높이
//     let footer_height = $("footer").height();
//
//     let gap = document_height - footer_height - window_height;
//     let bottom = document_scrollTop - gap ;
//
//     $("footer").css("bottom","0");
//
//     // if(document_scrollTop > gap && gap >= 0){
//     //     $("footer").css("bottom", bottom+"px");
//     // }else{
//     //     $("footer").css("bottom","0");
//     // }
// }

const footer = {
    init: function() {
        const _this = this;

        $(".mf-search").on('click', function (event) {
            _this.search();
            event.preventDefault();
            return false;
        });

        $(".mf-ranking").on('click', function (event) {
            _this.ranking();
            event.preventDefault();
            return false;
        });

        $(".mf-ranker").on('click', function (event) {
            _this.ranker();
            event.preventDefault();
            return false;
        });
    },
    search: function () {
        if($(".mf-search").hasClass("mb-active") === true) {
            return false;
        }
        location.href = "/";
    },
    ranking: function () {
        if($(".mf-ranking").hasClass("mb-active") === true) {
            return false;
        }
        location.href = "/ranking";
    },
    ranker: function () {
        if($(".mf-ranker").hasClass("mb-active") === true) {
            return false;
        }
        location.href = "/ranker";
    }
};

footer.init();
