(() => {
  'use strict';
  const leaderboard = {};
  leaderboard.getURLParam = function (param) {
    const url = new URL(location.href);
    const searchParams = new URLSearchParams(url.search);
    return searchParams.get(param);
  };

  leaderboard.updateUrl = function () {
    let newUrl = '?groupId=' + document.getElementById('groupId').value;
    window.location = encodeURI(newUrl);
  };

  leaderboard.addRows = function (id, element) {
    const tableBodyRef = document.getElementById(id).getElementsByTagName('tbody')[0];
    let newRow = tableBodyRef.insertRow(tableBodyRef.rows.length);
    let newCell = newRow.insertCell(0);
    newCell.id = element.id;
    document.getElementById(
      element.id
    ).innerHTML = `<a href="http://fantasy.espn.com/nfl-pigskin-pickem/2020/en/entry?entryID=${element.id}" target="_blank">${element.name}</a>`;
    newCell = newRow.insertCell(1);
    newCell.appendChild(document.createTextNode(element.points));
    newCell = newRow.insertCell(2);
    newCell.appendChild(document.createTextNode(element.thisWeek));
    newCell = newRow.insertCell(3);
    newCell.appendChild(document.createTextNode(element.ppr));
    newCell = newRow.insertCell(4);
    newCell.appendChild(document.createTextNode(element.points + element.ppr));
    newCell = newRow.insertCell(5);
    newCell.appendChild(document.createTextNode(element.percentile.toFixed(1) + '%'));
  };

  leaderboard.getRequest = function () {
    const groupId = leaderboard.getURLParam('groupId');
    fetch(
      `http://fantasy.espncdn.com/nfl-pigskin-pickem/2020/en/api/v7/group?groupID=${groupId}&sort=-1&start=0&length=50&periodPoints=true`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.g.e !== null) {
          data.g.e.forEach(function (elem) {
            leaderboard.addRows('leaderboard', {
              name: elem.n_e,
              points: elem.p,
              ppr: elem.ppr === undefined ? 0 : elem.ppr,
              percentile: elem.pct,
              thisWeek: elem.pp['153'],
              id: elem.id,
            });
          });
        }
      });
  };

  document.getElementById('sub').onclick = leaderboard.updateUrl;

  const groupId = leaderboard.getURLParam('groupId');
  if (groupId !== null) {
    document.getElementById('groupId').value = groupId;
  }
  document.getElementById('groupId').addEventListener('keyup', function (event) {
    event.preventDefault();
    event.keyCode === 13 && document.getElementById('sub').click();
  });

  leaderboard.getRequest();
})();
