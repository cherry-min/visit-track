(function () {

  console.info(
    'welcome to VisitTrack url: https://visit-track.yoyou.org'
  );

  setTimeout(function () {
    var addHeadStr = '<meta property="og:site_counter_author" content="https://visit-track.yoyou.org"></meta>'
      + '<meta property="og:site_counter_author_url" content="https://visit-track.yoyou.org"></meta>';

    if (document.head) {
      document.head.innerHTML += addHeadStr;
    }
  }, 500);

  const script = document.currentScript;
  let dataBaseUrl = script.getAttribute('data-base-url');
  let dataPagePvId = script.getAttribute('data-page-pv-id');
  let dataPageUvId = script.getAttribute('data-page-uv-id');

  const VisitTrack = {};
  VisitTrack.version = '0.0.0';
  let BASE_API_PATH = 'https://visit-track.yoyou.org';

  VisitTrack.page_pv_id = "page_pv";
  VisitTrack.page_uv_id = "page_uv";
  if (dataBaseUrl) {
    BASE_API_PATH = dataBaseUrl;
  }
  if (dataPagePvId) {
    VisitTrack.page_pv_id = dataPagePvId;
  }
  if (dataPageUvId) {
    VisitTrack.page_uv_id = dataPageUvId;
  }

  /**
   * @description: init Fetch json from api
   * @return {Object}
   */
  VisitTrack.init = async function () {
    const thisPage = getLocation(window.location.href);
    const pagePvEle = document.getElementById(VisitTrack.page_pv_id);
    const pageUvEle = document.getElementById(VisitTrack.page_uv_id);
    const queryData = {
      url: thisPage.pathname,
      hostname: thisPage.hostname,
      referrer: document.referrer
    }
    if (pagePvEle) {
      queryData.pv = true;
    }
    if (pageUvEle) {
      queryData.uv = true;
    }
    await fetchJson(`${BASE_API_PATH}/api/visit`, queryData)
      .then((res) => {
        if (res.ret != 'OK') {
          console.error('VisitTrack.init error', res.message);
          return;
        }
        const resData = res.data;
        if (pagePvEle) {
          pagePvEle.innerText = resData.pv;
        }
        if (pageUvEle) {
          pageUvEle.innerText = resData.uv;
        }
      })
      .catch((err) => {
        console.log("VisitTrack.init fetch error", err);
      });
  };

  /**
   * @description: Fetch json from api
   * @param {String} url response from url
   * @return {Object}
   */
  function fetchJson(url, data) {
    return new Promise((resolve) => {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(res => {
          return res.json();
        })
        .then(function (data) {
          resolve(data);
        })
        .catch(err => {
          console.error(err);
        });
    });
  }

  const getLocation = function (href) {
    const l = document.createElement("a");
    l.href = href;
    return l;
  };

  if (typeof window !== 'undefined') {
    VisitTrack.init();
    window.VisitTrack = VisitTrack;
  }
})();
