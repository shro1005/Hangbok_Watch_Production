const free = {
    init : function() {
        $('.navbar-nav .commu-nav').addClass("active");

        const _this = this;
        $('#btn-search-tap').on('click', function (event) {
            _this.search("");

            return false;
        });

        let category = $(".category").val();
        console.log(category);
        showBoardList(category);

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

const showBoardList = (target) => {
    $('.active').removeClass('active');
    if(target == "free") {
        $('.total_titular').addClass('active');
        // console.log("total_offset : " +total_offset);

    }else if(target == "party") {
        $('.tank_titular').addClass('active');
        // console.log("tank_offset : " +tank_offset);

    }else if(target == "mypage") {
        $('.deal_titular').addClass('active');
        // console.log("deal_offset : " +deal_offset);

    }
};


free.init();