'use strict';

var Nodes = {
  MAP: document.querySelector('.map'),
  MAP_PINS_BLOCK: document.querySelector('.map__pins'),
  MAP_PIN_TEMPLATE: document.querySelector('#pin')
    .content
    .querySelector('.map__pin'),
  CARD_TEMPLATE: document.querySelector('#card')
    .content
    .querySelector('.map__card'),
};
var Offset = {
  MAP_PIN_X: 25,
  MAP_PIN_Y: 70,
};
var PinLocation = {
  MIN_X: 0,
  MIN_Y: 150,
  MAX_Y: 650,
};
var Price = {
  MIN: 0,
  MAX: 15000,
};
var Guest = {
  MIN: 1,
  MAX: 10,
};
var ROOMS = [1, 2, 3, 100];
var Types = {
  'palace': 'Дворец',
  'flat': 'Квартиа',
  'house': 'Дом',
  'bungalo': 'Бунгало',
};
var TimeCheck = ['12:00', '13:00', '14:00'];
var Features = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner',
];
var Photos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg',
];
var USER_COUNT = 8;

var getWidthElement = function (element) {
  return element.offsetWidth;
};

var createImageName = function (number) {
  return 'img/avatars/user' + ('' + (number + 1)).padStart(2, 0) + '.png';
};

var getRandomBetween = function (min, max) {
  return Math.floor((Math.random() * (max - min + 1)) + min);
};

var getRandomElement = function (array) {
  return array[getRandomBetween(0, array.length - 1)];
};

var getRandomElements = function (array) {
  var number = Math.floor(Math.random() * (array.length + 1));
  var newArray = array.slice();

  return newArray.splice(0, number);
};

var createUserData = function (number) {
  var locationX = getRandomBetween(PinLocation.MIN_X, getWidthElement(Nodes.MAP));
  var locationY = getRandomBetween(PinLocation.MIN_Y, PinLocation.MAX_Y);
  var userData = {
    author: {
      avatar: createImageName(number)
    },

    location: {
      x: locationX,
      y: locationY,
    },

    offer: {
      title: 'заголовок предложения',
      address: locationX + ', ' + locationY,
      price: getRandomBetween(Price.MIN, Price.MAX),
      type: getRandomElement(Object.keys(Types)),
      rooms: getRandomElement(ROOMS),
      guests: getRandomBetween(Guest.MIN, Guest.MAX),
      checkin: getRandomElement(TimeCheck),
      checkout: getRandomElement(TimeCheck),
      features: getRandomElements(Features),
      description: 'строка с описанием',
      photos: getRandomElements(Photos),
    }
  };

  return userData;
};

var createUsers = function () {
  var users = [];

  for (var i = 1; i <= USER_COUNT; i++) {
    var userData = createUserData(i);
    users.push(userData);
  }

  return users;
};

// функция активация/деактивация карты. true - активация, false - деактивация
var activationMap = function (active) {
  var fadedClass = 'map--faded';

  if (active || Nodes.MAP.classList.contains(fadedClass)) {
    Nodes.MAP.classList.remove(fadedClass);
  } else {
    Nodes.MAP.classList.add(fadedClass);
  }
};

// функция создания шаблона метки на карте
var createPin = function (user) {
  var pin = Nodes.MAP_PIN_TEMPLATE.cloneNode(true);

  pin.style.left = (user.location.x - Offset.MAP_PIN_X) + 'px';
  pin.style.top = (user.location.y - Offset.MAP_PIN_Y) + 'px';

  var pinImage = pin.querySelector('img');
  pinImage.src = user.author.avatar;
  pinImage.alt = user.offer.title;

  return pin;
};

// функция создания карточки
var createCard = function (user) {
  var card = Nodes.CARD_TEMPLATE.cloneNode(true);

  var cardAvatar = card.querySelector('.popup__avatar');
  if (user.author.hasOwnProperty('avatar')) {
    cardAvatar.src = user.author.avatar;
  } else {
    cardAvatar.remove();
  }

  var cardTitle = card.querySelector('.popup__title');
  if (user.offer.hasOwnProperty('title')) {
    cardTitle.textContent = user.offer.title;
  } else {
    cardTitle.remove();
  }

  var cardAddress = card.querySelector('.popup__text--address');
  if (user.offer.hasOwnProperty('address')) {
    cardAddress.textContent = user.offer.address;
  } else {
    cardAddress.remove();
  }

  var cardPrice = card.querySelector('.popup__text--price');
  if (user.offer.hasOwnProperty('price')) {
    cardPrice.textContent = user.offer.price + '₽/ночь';
  } else {
    cardPrice.remove();
  }

  var cardType = card.querySelector('.popup__type');
  if (user.offer.hasOwnProperty('type')) {
    cardType.textContent = Types[user.offer.type];
  } else {
    cardType.remove();
  }

  var cardCapacity = card.querySelector('.popup__text--capacity');
  if (user.offer.hasOwnProperty('rooms') && user.offer.hasOwnProperty('guests')) {
    cardCapacity.textContent = user.offer.rooms + ' комнаты для ' + user.offer.guests + ' гостей';
  } else {
    cardCapacity.remove();
  }

  var cardTime = card.querySelector('.popup__text--time');
  if (user.offer.hasOwnProperty('checkin') && user.offer.hasOwnProperty('checkout')) {
    cardTime.textContent = 'Заезд после ' + user.offer.checkin + ', выезд до ' + user.offer.checkout;
  } else {
    cardTime.remove();
  }

  var cardFeaturesList = card.querySelector('.popup__features');
  if (user.offer.hasOwnProperty('features')) {
    cardFeaturesList.textContent = user.offer.features;
  } else {
    cardFeaturesList.remove();
  }

  var cardDescription = card.querySelector('.popup__description');
  if (user.offer.hasOwnProperty('description')) {
    cardDescription.textContent = user.offer.description;
  } else {
    cardDescription.remove();
  }

  var cardPhoto = card.querySelector('.popup__photos');
  if (user.offer.hasOwnProperty('photos')) {
    var cardPhotoImg = cardPhoto.querySelector('.popup__photo');
    cardPhotoImg.remove();

    user.offer.photos.forEach(function (photo) {
      var newPhoto = cardPhotoImg.cloneNode(true);
      newPhoto.src = photo;
      cardPhoto.appendChild(newPhoto);
    });
  } else {
    cardPhoto.remove();
  }

  return card;
};

// создание фрагмента
var createElements = function (data, element) {
  var fragment = document.createDocumentFragment();
  data.forEach(function (user) {
    var newElement = element(user);

    fragment.appendChild(newElement);
  });

  return fragment;
};

// отрисовка меток на карте и активация карты
var renderPins = function () {
  var users = createUsers();
  var pins = createElements(users, createPin);
  var cards = createElements(users, createCard);
  Nodes.MAP_PINS_BLOCK.appendChild(pins);
  Nodes.MAP_PINS_BLOCK.insertAdjacentElement('afterend', cards.children[2]);

  activationMap(true);
};

renderPins();
