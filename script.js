const STATES = {
    personData : [],
    sortedPersonData : [],
    filtersData: [],
    genderStatus: false,
}
const SELECTORS = {
    dataList : document.querySelector('.content__list'),
    radioButtons: document.querySelectorAll('.filter__radio'),
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

const renderDataContent = (arrayForRender) => {
    SELECTORS.dataList.innerHTML = '';
    arrayForRender.forEach((element) => {
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
    arrayForFilter.sort(( a, b ) => a.fullName > b.fullName ? 1 : -1);
    renderDataContent(arrayForFilter);
}

const sortZA = (arrayForFilter) => {
    arrayForFilter.sort(( a, b ) => a.fullName > b.fullName ? 1 : -1);
    renderDataContent(arrayForFilter.reverse());
}

const sortAgeUp = (arrayForFilter) => {
    arrayForFilter.sort(( a, b ) => a.age > b.age ? 1 : -1);
    renderDataContent(arrayForFilter);
}

const sortAgeDown = (arrayForFilter) => {
    arrayForFilter.sort(( a, b ) => a.age > b.age ? 1 : -1);
    renderDataContent(arrayForFilter.reverse());
}

const sortGender = (genderValue) => {
    STATES.genderStatus = true;
    STATES.sortedGenderData = STATES.sortedPersonData.filter((person) => person.gender === genderValue);
    renderDataContent(STATES.sortedGenderData);
}

const sortName = (arrayForFilter, filterContent) => {
    return arrayForFilter.filter((element) => element.fullName.toLowerCase().includes(filterContent.toLowerCase()))
}

const chooseArrayForFilter = () => {
    return STATES.genderStatus ? STATES.sortedGenderData : STATES.sortedPersonData
}

const applyFilters = () => {
    STATES.filtersData.forEach((filter) => {
        if  (filter === 'az'){
            sortAZ(chooseArrayForFilter());
        }
    
        if (filter === 'za'){
            sortZA(chooseArrayForFilter());
        }
    
        if (filter === 'ageUp'){
            sortAgeUp(chooseArrayForFilter());
        }
    
        if (filter === 'ageDown'){
            sortAgeDown(chooseArrayForFilter());
        }
    
        if (filter === 'male' || filter === 'female'){
            sortGender(filter);
        }
    })
}

for (const radioButton of SELECTORS.radioButtons) {
    radioButton.addEventListener('change', function(event) {
        STATES.filtersData.push(event.target.dataset.sortType);
        applyFilters();
    });
}

SELECTORS.clearFilterButton.addEventListener('click', function(){
    for (const radioButton of SELECTORS.radioButtons){
        radioButton.checked = false;
    }
    renderDataContent(STATES.personData);
});

SELECTORS.nameSearch.addEventListener('input', function(){
    renderDataContent(sortName(STATES.genderStatus ? STATES.sortedGenderData : STATES.sortedPersonData, this.value));
})
