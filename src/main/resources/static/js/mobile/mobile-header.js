const ouathBlizzard = () => {
    location.href="/oauth2/authorization/blizzard";
};

const logoutBlizzard = () => {
    location.href="/logout"
};

const init = () => {
    if(window.location.pathname.indexOf("ranking") > 0) {
        $('.mb-navbar-brand').attr("href", "#");
        $('.mb-navbar-brand').html("금주랭킹");
    }
    else if(window.location.pathname.indexOf("ranker") > 0) {
        $('.mb-navbar-brand').attr("href", "#");
        $('.mb-navbar-brand').html("랭커보기");
    }
    else if(window.location.pathname.indexOf("search") > 0) {
        $('.mb-navbar-brand').attr("href","javascript:history.back();");
        $('.mb-navbar-brand').html("<img class='mb-back-img' src='/HWimages/util/back.png'>");
    }
    else if(window.location.pathname.indexOf("showPlayerDetail") > 0) {
        $('.mb-navbar-brand').attr("href","javascript:history.back();");
        $('.mb-navbar-brand').html("<img class='mb-back-img' src='/HWimages/util/back.png'>");
    }
    else if(window.location.pathname.indexOf("refreshPlayerDetail") > 0) {
        $('.mb-navbar-brand').attr("href","/");
        $('.mb-navbar-brand').html("<img class='mb-back-img' src='/HWimages/util/back.png'>");
    }
};

init();