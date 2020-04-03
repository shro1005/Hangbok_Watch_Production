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
    $('.active').removeClass('active');
    $('.community-container').empty();
    if(target === "free") {
        $('.total_titular').addClass('active');
        // console.log("total_offset : " +total_offset);
        getBoardTagData("익명게시판");
        getContentData(target, pageNum, boardTagCd);

    }else if(target === "party") {
        $('.tank_titular').addClass('active');
        // console.log("tank_offset : " +tank_offset);
        getBoardTagData("듀오/파티 모집");
        getContentData(target, pageNum, boardTagCd);

    }else if(target === "mypage") {
        $('.deal_titular').addClass('active');
        // console.log("deal_offset : " +deal_offset);

    }
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
        items.buttons.push({boardTagCd : "00", boardTagVal : "전체보기", clicked: "clicked"});
        $.each(datas, function (i, data) {
            if(data.boardTagCd === "01") {}
            else {
                items.buttons.push({boardTagCd: data.boardTagCd, boardTagVal: data.boardTagVal, clicked: ""});
            }
        });
        items.buttons.push({boardTagCd : "99", boardTagVal : "10추글", clicked: ""});
    });

    const inputItem = template(items);
    $(".community-container").append(inputItem);

};

const getContentData = (target, pageNum, boardTagCd) => {
    let totalPage;
    if(target === 'free') {
        totalPage = $('.free-page-num').val();
    }else if (target === 'party') {
        totalPage = $('.party-page-num').val();
    }else if (target === 'mypage') {
        totalPage = $('.my-page-num').val();
    }
    let input;

    const contentList = $('#content-list').html();
    const template = Handlebars.compile(contentList);

    const item = {
        contents: []
    };

    if(totalPage === "" || totalPage == null) {
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
            totalPage = datas.totalPages;
            const totalElement = datas.totalElements;
            
            if(target === 'free') {
                $('.free-page-num').val(totalElement);
            }else if (target === 'party') {
                $('.party-page-num').val(totalElement);
            }else if (target === 'mypage') {
                $('.my-page-num').val(totalElement);
            }

            $.each(lists, function (i, content) {
                console.log(content);
                item.contents.push(
                    {contNum: content.boardId, title: content.title , writer: "익명", rgtDtm: content.rgtDtm,
                        watchingCount: content.seeCount, likeCount: content.likeCount}
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
    }else {
        input = {target: target, pageNum: pageNum, boardTagCd: boardTagCd, isFirst: false};
    }

    const listItem = template(item);
    $('.community-container').append(listItem);
};

const paging = (pagination, options) => {
    if (!pagination) {
        return '';
    }

    let limit = 7;
    let n = 1;
    let queryParams = '';
    let page = parseInt(pagination.page || 0);
    let leftText = '<i class="fas fa-angle-left"></i>';
    let rightText = '<i class="fas fa-angle-right"></i>';
    let firstText = '<i class="fas fa-angle-double-left"></i>';
    let lastText = '<i class="fas fa-angle-double-right"></i>';
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
        template = template + '<li class="page-item disabled"><a class="page-link" href="?page=1' + queryParams + '">' + firstText + '</a></li>';
    } else {
        template = template + '<li class="page-item"><a class="page-link" href="?page=1' + queryParams + '">' + firstText + '</a></li>';
    }

    // ========= Previous Button ===============
    if (page === 1) {
        n = 1;
        template = template + '<li class="page-item disabled"><a class="page-link" href="?page=' + n + queryParams + '">' + leftText + '</a></li>';
    } else {
        if (page <= 1) {
            n = 1;
        } else {
            n = page - 1;
        }
        template = template + '<li class="page-item"><a class="page-link" href="?page=' + n + queryParams + '">' + leftText + '</a></li>';
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
            template = template + '<li class="page-item active"><a class="page-link" href="?page=' + n + queryParams + '">' + n + '</a></li>';
        } else {
            template = template + '<li class="page-item"><a class="page-link" href="?page=' + n + queryParams + '">' + n + '</a></li>';
        }

        start++;
        i++;
    }

    // ========== Next Button ===========
    if (page === pageCount) {
        n = pageCount;
        template = template + '<li class="page-item disabled"><a class="page-link" href="?page=' + n + queryParams + '">' + rightText + '</i></a></li>';
    } else {
        if (page >= pageCount) {
            n = pageCount;
        } else {
            n = page + 1;
        }
        template = template + '<li class="page-item"><a class="page-link" href="?page=' + n + queryParams + '">' + rightText + '</a></li>';
    }

    // ========= Last Button ===============
    if (page === pageCount) {
        template = template + '<li class="page-item disabled"><a class="page-link" href="?page=' + pageCount + queryParams + '">' + lastText + '</a></li>';
    } else {
        template = template + '<li class="page-item"><a class="page-link" href="?page=' + pageCount + queryParams + '">' + lastText + '</a></li>';
    }

    template = template + '</ul>';
    return template;
};

free.init();

