let category = $('.category').val();
let buttonTagCd = $('.buttonTagCd').val();

const free = {
    init : function() {
        $('.navbar-nav .commu-nav').addClass("active");

        const _this = this;
        $('#btn-search-tap').on('click', function (event) {
            _this.search("");

            return false;
        });

        let category = $(".category").val();
        // console.log(category);
        showBoardList(category, 1,"00");

    },
    search : function () {
        // alert('main search 호출');
        let playerName = $('input[id="playerName"]').val();
        if(playerName =="") {return false;}
        else if(playerName.indexOf("#") != -1) {
            // alert("detail playerName # : " + playerName);
            playerName = playerName.replace("#", "-");
        }
        // alert("detail playerName - : " + playerName);
        // console.log("검색한 playerName : " + playerName);
        location.href = "/search/" + playerName;
    }
};

const showBoardList = (target, pageNum, boardTagCd) => {
    $('.category').val(target);
    $('.buttonTagCd').val(boardTagCd);
    $('.active').removeClass('active');
    $('.community-container').empty();
    $('.paging-button-container').empty();
    if(target === "free") {
        $('.total_titular').addClass('active');
        // console.log("total_offset : " +total_offset);
        getBoardTagData("익명게시판");
        getNoticeData(target);
        getContentData(target, pageNum, boardTagCd);

    }else if(target === "party") {
        $('.tank_titular').addClass('active');
        // console.log("tank_offset : " +tank_offset);
        getBoardTagData("듀오/파티 모집");
        getNoticeData(target);
        getContentData(target, pageNum, boardTagCd);

    }else if(target === "mypage") {
        $('.deal_titular').addClass('active');
        getNoticeData(target);
        getContentData(target, pageNum, boardTagCd);

    }
    $('.board-tag-button').removeClass("clicked")
    $('.category-'+boardTagCd).addClass("clicked");
};

const getOtherPage = (pageNum) => {
    category = $('.category').val();
    buttonTagCd = $('.buttonTagCd').val();
    $('.table-responsive').remove();
    $('.paging-button-container').empty();

    getNoticeData(category);
    getContentOtherPage(category, pageNum, buttonTagCd);
};

const getBoardTagData = (target) => {
    $('.board-tag-buttons').remove();
    const input = {category : target};

    const button_html = $('#board-tag-buttons').html();
    const template = Handlebars.compile(button_html);

    const items = {
        buttons : []
    };

    $.ajax({
        type: 'POST',
        url: '/community/getBoardTag',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(input),
        async : false
    }).done(function (datas) {
        items.buttons.push({boardTagCd : "00", boardTagVal : "전체보기", clicked: "clicked", category: $('.category').val()});
        $.each(datas, function (i, data) {
            let categoryCd = data.categoryCd; let categoryVal = "";
            if(categoryCd === "01") {categoryVal = "free";}
            else if(categoryCd === "02") {categoryVal = "party";}
            if(data.boardTagCd === "01") {}
            else {
                items.buttons.push({boardTagCd: data.boardTagCd, boardTagVal: data.boardTagVal, clicked: "", category: $('.category').val()});
            }
        });
        items.buttons.push({boardTagCd : "99", boardTagVal : "10추글", clicked: "", category: $('.category').val()});
    });

    const inputItem = template(items);
    $(".community-container").append(inputItem);

};

const getNoticeData = (target) => {
    let input = {target : target};

    const contentList = $('#content-list').html();
    const template = Handlebars.compile(contentList);

    const item = {
        contents: []
    };

    $.ajax({
        type: 'POST',
        url: '/community/getNoticeData',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(input),
        async: false
    }).done(function (datas) {
        $.each(datas, function (i, content) {
            console.log(content);
            // console.log(content.categoryCd);
            let writer = "관리자"; let tag = "공지";

            // console.log(tag);
            item.contents.push(
                {contNum: tag, title: content.title , writer: writer, rgtDtm: content.rgtDtm,
                    watchingCount: content.seeCount, likeCount: content.likeCount, tag : tag}
            )
        });

    });

    const listItem = template(item);
    $('.community-container').append(listItem);
};

const getContentData = (target, pageNum, boardTagCd) => {
    // let totalPage = $('.total-page-num').val();
    // if(target === 'free') {
    //     totalPage = $('.free-page-num').val();
    // }else if (target === 'party') {
    //     totalPage = $('.party-page-num').val();
    // }else if (target === 'mypage') {
    //     totalPage = $('.my-page-num').val();
    // }
    let input;

    const contentList = $('#more_content_list').html();
    const template = Handlebars.compile(contentList);

    const item = {
        contents: []
    };

    input = {target: target, pageNum: pageNum, boardTagCd: boardTagCd, isFirst: true};

    $.ajax({
        type: 'POST',
        url: '/community/getContentData',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(input),
        async: false
    }).done(function (datas) {
        // console.log(datas);

        const lists = datas.content;
        const totalPage = datas.totalPages;
        const totalElement = datas.totalElements;

        $('.total-page-num').val(totalPage);
        $('.total-elements-num').val(totalElement);

        $.each(lists, function (i, content) {
            console.log(content);
            // console.log(content.categoryCd);
            let writer = "익명"; let tag = "";
            if (content.categoryCd === "01") {
                // console.log("익명 게시글");
                if (content.boardTagCd === "01") {
                    tag = "공지";
                } else if (content.boardTagCd === "02") {
                    tag = "잡담";
                } else if (content.boardTagCd === "03") {
                    tag = "리그";
                } else if (content.boardTagCd === "04") {
                    tag = '워크숍';
                }
            }else if(content.categoryCd === "02") {
                writer = content.battleTag;
                if (content.boardTagCd === "01") {
                    tag = '공지';
                } else if (content.boardTagCd === "02") {
                    tag = '파티모집';
                } else if (content.boardTagCd === "03") {
                    tag = '탱커모집';
                } else if (content.boardTagCd === "04") {
                    tag = '딜러모집';
                } else if (content.boardTagCd === "05") {
                    tag = '힐러모집';
                } else if (content.boardTagCd === "06") {
                    tag = '빠대모집';
                }
            }
            // console.log(tag);
            item.contents.push(
                {contNum: content.boardId, title: content.title , writer: writer, rgtDtm: content.rgtDtm,
                    watchingCount: content.seeCount, likeCount: content.likeCount, tag : tag}
            )
        });

        const pagination = {
            page: pageNum,       // The current page the user is on
            limit: 2,
            totalRows: totalElement  // The total number of available pages
        };

        const pagingHtml = paging(pagination);
        $('.paging-button-container').append(pagingHtml);
    });

    const listItem = template(item);
    $('.board-tbody:last').append(listItem);
};

const getContentOtherPage = (target, pageNum, boardTagCd) => {
    let input;

    const contentList = $('#more_content_list').html();
    const template = Handlebars.compile(contentList);

    const item = {
        contents: []
    };

    input = {target: target, pageNum: pageNum, boardTagCd: boardTagCd, isFirst: false};

    $.ajax({
        type: 'POST',
        url: '/community/getOtherPageData',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(input),
        async: false
    }).done(function (datas) {

        $.each(datas, function (i, content) {
            console.log(content);
            // console.log(content.categoryCd);
            let writer = "익명"; let tag = "";
            if (content.categoryCd === "01") {
                // console.log("익명 게시글");
                if (content.boardTagCd === "01") {
                    tag = "공지";
                } else if (content.boardTagCd === "02") {
                    tag = "잡담";
                } else if (content.boardTagCd === "03") {
                    tag = "리그";
                } else if (content.boardTagCd === "04") {
                    tag = '워크숍';
                }
            }else if(content.categoryCd === "02") {
                writer = content.battleTag;
                if (content.boardTagCd === "01") {
                    tag = '공지';
                } else if (content.boardTagCd === "02") {
                    tag = '파티모집';
                } else if (content.boardTagCd === "03") {
                    tag = '탱커모집';
                } else if (content.boardTagCd === "04") {
                    tag = '딜러모집';
                } else if (content.boardTagCd === "05") {
                    tag = '힐러모집';
                } else if (content.boardTagCd === "06") {
                    tag = '빠대모집';
                }
            }
            // console.log(tag);
            item.contents.push(
                {contNum: content.boardId, title: content.title , writer: writer, rgtDtm: content.rgtDtm,
                    watchingCount: content.seeCount, likeCount: content.likeCount, tag : tag}
            )
        });

        const pagination = {
            page: pageNum,       // The current page the user is on
            limit: 2,
            totalRows: $('.total-elements-num').val()  // The total number of available pages
        };

        const pagingHtml = paging(pagination);
        $('.paging-button-container').append(pagingHtml);
    });

    const listItem = template(item);
    $('.board-tbody:last').append(listItem);
};

const paging = (pagination, options) => {
    if (!pagination) {
        return '';
    }

    let limit = 7;
    let n = 1;
    let queryParams = '';
    let page = parseInt(pagination.page || 0);
    let leftText = '<i class="fa fa-angle-left"></i>';
    let rightText = '<i class="fa fa-angle-right"></i>';
    let firstText = '<i class="fa fa-angle-double-left"></i>';
    let lastText = '<i class="fa fa-angle-double-right"></i>';
    let paginationClass = 'pagination pagination-sm';

    // if (options.hash.limit) limit = +options.hash.limit;
    // if (options.hash.leftText) leftText = options.hash.leftText;
    // if (options.hash.rightText) rightText = options.hash.rightText;
    // if (options.hash.firstText) firstText = options.hash.firstText;
    // if (options.hash.lastText) lastText = options.hash.lastText;
    // if (options.hash.paginationClass) paginationClass = options.hash.paginationClass;

    let pageCount = Math.ceil(pagination.totalRows / pagination.limit);

    //query params
    if (pagination.queryParams) {
        queryParams = '&';
        for (let key in pagination.queryParams) {
            if (pagination.queryParams.hasOwnProperty(key) && key !== 'page') {
                queryParams += key + "=" + pagination.queryParams[key] + "&";
            }
        }
        let lastCharacterOfQueryParams = queryParams.substring(queryParams.length, -1);

        if (lastCharacterOfQueryParams === "&") {
            //trim off last & character
            queryParams = queryParams.substring(0, queryParams.length - 1);
        }
    }

    let template = '<ul class="' + paginationClass + '">';

    // ========= First Button ===============
    if (page === 1) {
        template = template + '<li class="page-item disabled"><a class="page-link" onclick="getOtherPage('+ n +');">' + firstText + '</a></li>';
    } else {
        template = template + '<li class="page-item"><a class="page-link" onclick="getOtherPage('+ n +');">' + firstText + '</a></li>';
    }

    // ========= Previous Button ===============
    if (page === 1) {
        n = 1;
        template = template + '<li class="page-item disabled"><a class="page-link" onclick="getOtherPage('+ n +');">' + leftText + '</a></li>';
    } else {
        if (page <= 1) {
            n = 1;
        } else {
            n = page - 1;
        }
        template = template + '<li class="page-item"><a class="page-link" onclick="getOtherPage('+ n +');">' + leftText + '</a></li>';
    }

    // ========= Page Numbers Middle ======
    let i = 0;
    let leftCount = Math.ceil(limit / 2) - 1;
    let rightCount = limit - leftCount - 1;
    if (page + rightCount > pageCount) {
        leftCount = limit - (pageCount - page) - 1;
    }
    if (page - leftCount < 1) {
        leftCount = page - 1;
    }
    let start = page - leftCount;

    console.log(leftCount, rightCount, start, limit, pageCount);
    while (i < limit && i < pageCount) {
        console.log(i);
        n = start;
        if (start === page) {
            template = template + '<li class="page-item active"><a class="page-link" onclick="getOtherPage('+ n +');">' + n + '</a></li>';
        } else {
            template = template + '<li class="page-item"><a class="page-link" onclick="getOtherPage('+ n +');">' + n + '</a></li>';
        }

        start++;
        i++;
    }

    // ========== Next Button ===========
    if (page === pageCount) {
        n = pageCount;
        template = template + '<li class="page-item disabled"><a class="page-link" onclick="getOtherPage('+ n +');">' + rightText + '</i></a></li>';
    } else {
        if (page >= pageCount) {
            n = pageCount;
        } else {
            n = page + 1;
        }
        template = template + '<li class="page-item"><a class="page-link" onclick="getOtherPage('+ n +');">' + rightText + '</a></li>';
    }

    // ========= Last Button ===============
    if (page === pageCount) {
        template = template + '<li class="page-item disabled"><a class="page-link" onclick="getOtherPage('+ $('.total-page-num').val() +');">' + lastText + '</a></li>';
    } else {
        template = template + '<li class="page-item"><a class="page-link" onclick="getOtherPage('+ $('.total-page-num').val() +');">' + lastText + '</a></li>';
    }

    template = template + '</ul>';
    return template;
};

free.init();

