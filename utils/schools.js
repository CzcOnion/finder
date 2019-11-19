var schoolData = [
  {
    "name": "华南理工大学",
    "code": "110001",
    "sub": [
    ]
  },
  {
    "name": "中山大学",
    "code": "110002",
    "sub": [
    ]
  },
  {
    "name": "华南工业大学",
    "code": "110003",
    "sub": [
    ]
  },{
    "name": "其他",
    "code": "110000",
    "sub": [
    ]
  }
];
function init(that) {
  that.setData({
    'schoolData': schoolData
  });
}

module.exports = {
  init: init
}