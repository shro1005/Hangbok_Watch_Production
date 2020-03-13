$(function(){
    stickyFooter();

    $(window).scroll(stickyFooter).resize(stickyFooter);
});

function stickyFooter(){
    document_height = $(document).height(); // 문서 전체 높이
    document_scrollTop = $(document).scrollTop(); // 문서 전체 높이 중 스크롤 위치
    window_height = $(window).height(); // 창 높이
    footer_height = $("footer").height();

    gap = document_height - footer_height - window_height;
    bottom = document_scrollTop - gap ;

    $("footer").css("bottom","0");

    // if(document_scrollTop > gap && gap >= 0){
    //     $("footer").css("bottom", bottom+"px");
    // }else{
    //     $("footer").css("bottom","0");
    // }
}

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
        location.href = "/mobile";
    },
    ranking: function () {
        if($(".mf-ranking").hasClass("mb-active") === true) {
            return false;
        }
        location.href = "/mobile/ranking";
    },
    ranker: function () {
        if($(".mf-ranker").hasClass("mb-active") === true) {
            return false;
        }
        location.href = "/mobile/ranker";
    }
};

footer.init();
