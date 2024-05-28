
// fetch the required elements 
const userTab=document.querySelector("[data-userWeather]"); 
const searchTab=document.querySelector("[data-searchWeather]"); 

const searchInput=document.querySelector("[data-searchinput]"); 

// fetch all the containers 
const grantLocationContainer=document.querySelector(".grant-location"); 
const searchForm=document.querySelector(".search-weather"); 
const loadingScreen=document.querySelector(".loading-container"); 
const weatherInfoContainer=document.querySelector(".show-weather-info"); 

//fetch all the button elements 
const grantBtn=document.querySelector(".grant-btn"); 
const searchBtn=document.querySelector(".search-btn"); 

// fetch all elements of show  weather information container 
const cityName=document.querySelector("[data-cityname]"); 
const countryName=document.querySelector("[data-countryname]"); 
const weatherType=document.querySelector("[data-weatherdes]"); 
const weatherIcon=document.querySelector("[data-weathericon]"); 
const temperatureValue=document.querySelector("[data-tempvalue]"); 
const  windspeedValue=document.querySelector("[data-windspeed]"); 
const  humidityValue=document.querySelector("[data-humidity]"); 
const  cloudsValue=document.querySelector("[data-clouds]"); 



// error tabs 

const notFound = document.querySelector('.error-container');
const errorBtn = document.querySelector('[data-errorButton]');
const errorText = document.querySelector('[data-errorText]');
const errorImage = document.querySelector('[data-errorImg]');

// variables 
const API_KEY= "565eb8ad5e77420e89d161154242505";
let currentTab=userTab;
currentTab.classList.add("currentTab"); 
getfromSessionsStorage(); 

// Adding the functionalities 

function switchTab(clickedTab){
    notFound.classList.add("active"); 
    // check if clickedTab is already selected or not 
    if(clickedTab!=currentTab){
        currentTab.classList.remove("currentTab"); 
        currentTab=clickedTab; 
        currentTab.classList.add("currentTab");
    // check which tab is selected- seary/your
    // if search form not contains active class then add [search weather]
    if(searchForm.classList.contains("active")){
        grantLocationContainer.classList.remove("active"); 
        weatherInfoContainer.classList.add("active"); 
        searchForm.classList.remove("active");  
    }
    // YOur weather 
    else {
        // Already on the search form tab , now at the your weather tab 
        searchForm.classList.add("active");
        getfromSessionsStorage(); 
        weatherInfoContainer.classList.remove("active");        
    }
}
}
userTab.addEventListener("click", ()=>{
    switchTab(userTab); 
}); 

searchTab.addEventListener("click", ()=>{
    switchTab(searchTab); 
}); 

// if User coordinates are present in session storage 

function getfromSessionsStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates"); 
    if(!localCoordinates){
        // if coordinates not present 
        grantLocationContainer.classList.add("active"); 
    } 
    else {
        // if coordinates are present 
        const coordinates=JSON.parse(localCoordinates); 
        fetchUserWeather(coordinates); 
    }
}

async function fetchUserWeather(coordinates){
     const {lat,lon}=coordinates;
     // make grant access invisible
     grantLocationContainer.classList.remove("active");
     // make loading screen visible 
     loadingScreen.classList.add("active"); 
     weatherInfoContainer.classList.add("active"); 

     try{
        const response=await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no`); 
        const data= await response.json(); 

        if(response.status === 400){
            notFound.classList.remove("active"); 
            loadingScreen.classList.remove("active"); 
         } else{
  // remove the loading screen 
  loadingScreen.classList.remove("active"); 
  // add the weatherInfoContainer 
  weatherInfoContainer.classList.remove("active"); 
  renderWeatherInformation(data); 
         }
      
     }
     catch(err){
        loadingScreen.classList.remove('active');
        notFound.classList.remove('active');
        // errorImage.style.display = 'none';
        errorText.innerText = `Error: ${err?.message}`;
        // errorBtn.style.display = 'block';
        errorBtn.addEventListener("click", fetchUserWeather);
     }

}

function renderWeatherInformation(data){
    const day_night= data?.current?.is_day ? "day" : "night";  
    cityName.innerText= data?.location?.name + ", ";
    countryName.innerText=data?.location?.country; 
    weatherType.innerText= data?.current?.condition?.text;
    temperatureValue.innerText= `${data?.current?.temp_c }°C`;
    humidityValue.innerText=`${data?.current?.humidity}%`;
    windspeedValue.innerText=`${data?.current?.wind_kph}km/h`; 
    cloudsValue.innerText=`${data?.current?.cloud}%`;
    weatherIcon.src=`https://cdn.weatherapi.com/weather/64x64/${day_night}/113.png`; 
}

function getlocation(){
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition); 
    }
    else{
        grantBtn.style.display='none';
    }
}
function showPosition(position){
    const userCoordinates={
        lat: 25.43,
        lon: 77.65
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates)); 
    fetchUserWeather(userCoordinates); 
}
// click on  Grant access button 
grantBtn.addEventListener("click",getlocation); 

// Handle the search city logic  
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault(); 
    if(searchInput.value ==="") {
        return;
    }
    fetchCityInfo(searchInput.value); 
    searchInput.value="";
})

async function fetchCityInfo(city){
    notFound.classList.add("active"); 
    grantLocationContainer.classList.remove("active"); 
    loadingScreen.classList.add("active"); 
    weatherInfoContainer.classList.add("active"); 
    try{
       
        const response= await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`); 
        const data= await response.json(); 
       
       if(response.status === 400){
          notFound.classList.remove("active"); 
          errorText.innerText = "Search not found";
          loadingScreen.classList.remove("active"); 
       }
         else{
            renderWeatherInformation(data); 
            loadingScreen.classList.remove("active"); 
            weatherInfoContainer.classList.remove("active"); 
         }  
        
    }catch(err){
        loadingScreen.classList.remove('active');
        weatherInfoContainer.classList.add('active');
        notFound.classList.remove('active');
        errorText.innerText = `${err?.message}`;
    }
}
