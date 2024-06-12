// src/components/Home.js
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import '../css/Home.css';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import queryString from 'query-string';
import logo from '../assets/nasa-logo.svg';

const Home = ({ isAuthenticated }) => {
  const [date, setDate] = useState(new Date());
  const [image, setImage] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [isLoadedImg, setIsLoadedImg] = useState(false);
  const [isFavouritedImg, setIsFavouritedImg] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const fetchImage = async (selectedDate) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/image?date=${selectedDate}`);
        document.querySelectorAll(`.dailyPhotoNasaExplanation`)[0].innerHTML = response.data.description;
        document.querySelectorAll(`.dailyPhotoNasaExplanation`)[0].style["margin-bottom"] = "20px";
        var token = localStorage.getItem('token');
        setImage(response.data.imageUrl);
        setIsLoadedImg(true);
        axios.post('http://localhost:5000/api/checkFavourite', { token, date: selectedDate })
      .then(response => {
        if (response.data.success) {
          if (response.data.data) {
            setIsFavouritedImg(true);
            document.querySelectorAll(`.dailyPhotoAddFavouriteRemove button`)[0].innerHTML = `Remove From Favourites`;
          }
          else {
            setIsFavouritedImg(false);
            document.querySelectorAll(`.dailyPhotoAddFavouriteRemove button`)[0].innerHTML = `Add To Favourites`;
          }
        }
        else {
          console.log(response.data);
          setIsFavouritedImg(false);
          document.querySelectorAll(`.dailyPhotoAddFavouriteRemove button`)[0].innerHTML = `Add To Favourites`;
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setIsFavouritedImg(false);
        document.querySelectorAll(`.dailyPhotoAddFavouriteRemove button`)[0].innerHTML = `Add To Favourites`;
      });
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    const query = queryString.parse(location.search);
    const selectedDate = query.date || date.toISOString().split('T')[0];
    setDate(new Date(selectedDate));
    fetchImage(selectedDate);
  }, [location.search]);

  const handleDateChange = (newDate) => {
    setImage(logo);
    setIsLoadedImg(false);
    setDate(newDate);
    const formattedDate = newDate.toISOString().split('T')[0];
    window.history.pushState({}, '', `?date=${formattedDate}`);

    axios.get(`http://localhost:5000/api/image?date=${formattedDate}`)
      .then(response => {
        document.querySelectorAll(`.dailyPhotoNasaExplanation`)[0].innerHTML = response.data.description;
        setImage(response.data.imageUrl);
        setIsLoadedImg(true);

        var token = localStorage.getItem('token');
        axios.post('http://localhost:5000/api/checkFavourite', { token, date: formattedDate })
        .then(response2 => {
          if (response2.data.success) {
            if (response2.data.data) {
              setIsFavouritedImg(true);
              document.querySelectorAll(`.dailyPhotoAddFavouriteRemove button`)[0].innerHTML = `Remove From Favourites`;
            }
            else {
              setIsFavouritedImg(false);
              document.querySelectorAll(`.dailyPhotoAddFavouriteRemove button`)[0].innerHTML = `Add To Favourites`;
            }
          }
          else {
            console.log(response2.data);
            setIsFavouritedImg(false);
            document.querySelectorAll(`.dailyPhotoAddFavouriteRemove button`)[0].innerHTML = `Add To Favourites`;
          }
        })
        .catch(error2 => {
          console.error('Error:', error2);
          setIsFavouritedImg(false);
          document.querySelectorAll(`.dailyPhotoAddFavouriteRemove button`)[0].innerHTML = `Add To Favourites`;
        });

      })
      .catch(error => {
        console.error('Error fetching image:', error);
      });
    setShowCalendar(false);
    document.querySelectorAll(`.CalendarDivB`)[0].style["margin-bottom"] = "0px";
    document.querySelectorAll(`.dailyPhotoOpenCalendar button`)[0].innerHTML = `Change Date`;

  };

  const openCalendar = () => {
    setShowCalendar(!showCalendar);
    if (!showCalendar) {
      document.querySelectorAll(`.CalendarDivB`)[0].style["margin-bottom"] = "50px";
      document.querySelectorAll(`.dailyPhotoOpenCalendar button`)[0].innerHTML = `Close Calendar`;
    }
    else {
      document.querySelectorAll(`.CalendarDivB`)[0].style["margin-bottom"] = "0px";
      document.querySelectorAll(`.dailyPhotoOpenCalendar button`)[0].innerHTML = `Change Date`;
    }
  };

  const AddFavouriteRemove = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      const token = localStorage.getItem('token');
      axios.post('http://localhost:5000/api/setFavourite', { token, situation: isFavouritedImg ? `remove` : `add`, date, image })
      .then(response => {
        if (response.data.success) {
          if (isFavouritedImg) {
            setIsFavouritedImg(false);
            document.querySelectorAll(`.dailyPhotoAddFavouriteRemove button`)[0].innerHTML = `Add To Favourites`;
          }
          else {
            setIsFavouritedImg(true);
            document.querySelectorAll(`.dailyPhotoAddFavouriteRemove button`)[0].innerHTML = `Remove From Favourites`;
          }
        }
        else {
          console.log(response.data);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div className='dailyPhotoUpper'>
          {isAuthenticated ? (
            <>
            <div className='dailyPhotoOpenFavourites'><Link to="/favourites">See Favorites</Link></div>
            </>
          ) : (
            <>
            </>
          )}
        <h1>| Daily Photo |</h1>
        <div className='dailyPhotoOpenCalendar'><button onClick={openCalendar}>Change Date</button></div>
      </div>
      <div className='CalendarDivB'>
      {showCalendar && <Calendar onChange={handleDateChange} value={date} maxDate={new Date()} />}
      </div>
      <div className='dailyPhotoNasaExplanation'></div>
      {isLoadedImg ? (
            <>
            <div className='dailyPhotoAddFavouriteRemove'><button onClick={AddFavouriteRemove}>Add To Favorites</button></div>
            </>
          ) : (
            <>
            </>
          )}
      <div className="dailyPhotoNasa" style={{  width: "100%" }}>
        <img src={image} className="dailyPhotoNasaImg" alt="Daily Image" style={{ maxWidth: "100%" }} />
      </div>
    </div>
  );
};

export default Home;
