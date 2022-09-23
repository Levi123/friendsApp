const STATES = {
    personData : [],
    sortedPersonData : [],
    genderPersonData: [],
    filtersData: [],
    filterType: '',
    genderStatus: '',
}
const SELECTORS = {
    dataList : document.querySelector('.content__list'),
    radioButtons: document.getElementsByName('sort-az-age'),
    radioButtonsGender: document.getElementsByName('sort-gender'),
    clearFilterButton: document.querySelector('.search__button'),
    nameSearch: document.querySelector('.form__name'),
}

async function getPersonData() {
    const response = await fetch('https://randomuser.me/api/?results=20&inc=gender,name,email,phone,picture,dob');
    const data = await response.json();

    STATES.personData = data.results.map((personDataElement) => ({
        fullName: `${personDataElement.name.first} ${personDataElement.name.last}`,
        age: personDataElement.dob.age,
        mail: personDataElement.email,
        gender: personDataElement.gender,
        phone: personDataElement.phone,
        photo: personDataElement.picture.medium,
    }));
    STATES.sortedPersonData = [...STATES.personData];
    renderDataContent(STATES.personData);
}
getPersonData();

const renderDataContent = (arrayForFilter) => {
    SELECTORS.dataList.innerHTML = '';
    arrayForFilter.forEach((element) => {
        let {fullName, age, mail, phone, photo} = element;
        let list = `
        <li class="content__element" data-person-name="${fullName}">
            <img src="${photo}" alt="photo profile" class="element__photo">
            <div class="element__details">
                <h2 class="element__name">${fullName}</h2>
                <h4 class="element__age">Age: ${age}</h4>
                <p class="element__phone">${phone}</p>
                <p class="element__email">${mail}</p>
                <button type="button" class="button__add">Add to friend</button>
            </div>
        </li>`
        SELECTORS.dataList.innerHTML += list;
        SELECTORS.personName = document.querySelectorAll('.element__name');
    })
}

const sortAZ = (arrayForFilter) => { 
    return arrayForFilter.sort(( a, b ) => a.fullName > b.fullName ? 1 : -1);
}

const sortZA = (arrayForFilter) => {
    return arrayForFilter.sort(( a, b ) => a.fullName < b.fullName ? 1 : -1);
}

const sortAgeUp = (arrayForFilter) => {
    return arrayForFilter.sort(( a, b ) => a.age > b.age ? 1 : -1);
}

const sortAgeDown = (arrayForFilter) => {
    return arrayForFilter.sort(( a, b ) => a.age < b.age ? 1 : -1);
}

const sortGender = (filter) => {
    STATES.genderPersonData = STATES.sortedPersonData.filter((person) => person.gender === filter);
}

const sortName = (filterContent) => {
    if (STATES.genderPersonData.length > 0){
        return STATES.genderPersonData.filter((element) => element.fullName.toLowerCase().includes(filterContent.toLowerCase()))
    }
    return STATES.sortedPersonData.filter((element) => element.fullName.toLowerCase().includes(filterContent.toLowerCase()))
}

const applyFilters = (arrayForFilter) => {
    STATES.filtersData.forEach((filterType) => { 
        if  (filterType === 'az'){
            renderDataContent(sortAZ(arrayForFilter));
        }

        if (filterType === 'za'){
            renderDataContent(sortZA(arrayForFilter));
        }

        if (filterType === 'ageUp'){
            renderDataContent(sortAgeUp(arrayForFilter));
        }

        if (filterType === 'ageDown'){
            renderDataContent(sortAgeDown(arrayForFilter));
        }
    })
}

for (const radioButton of SELECTORS.radioButtons) {
    radioButton.addEventListener('change', function(event) {

        STATES.filterType = event.target.dataset.sortType;
        STATES.filtersData.push(STATES.filterType);
        if (STATES.genderPersonData.length > 0){
            console.log("hi")
            STATES.filtersData = [];
            STATES.filtersData.push(STATES.filterType);
            applyFilters(STATES.genderPersonData);
        } else {
            applyFilters(STATES.sortedPersonData);
        }
    });
}

for (const radioButton of SELECTORS.radioButtonsGender) {
    radioButton.addEventListener('change', function(event) {
        STATES.filterType = event.target.dataset.sortType;
        STATES.genderStatus = STATES.filterType;
        sortGender(STATES.filterType);
        if (STATES.filtersData.length != 0){
            applyFilters(STATES.genderPersonData)
        }
        renderDataContent(STATES.genderPersonData)
    })
}

SELECTORS.clearFilterButton.addEventListener('click', function(){
    for (const radioButton of SELECTORS.radioButtons){
        radioButton.checked = false;
    }
    renderDataContent(STATES.personData);
});

SELECTORS.nameSearch.addEventListener('input', function(){
    renderDataContent(sortName(this.value));
})
