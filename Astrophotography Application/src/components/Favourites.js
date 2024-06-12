// src/components/Favourites.js
import React, { useState, useEffect } from 'react';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import '../css/Favourites.css';
import { useNavigate, Link } from 'react-router-dom';

const Favourites = ({ isAuthenticated }) => {
  const [favourites, setFavourites] = useState([]);
  const navigate = useNavigate();

    if (!isAuthenticated) {
      navigate('/login');
    }

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        var token = localStorage.getItem('token');
        axios.post('http://localhost:5000/api/seeFavourites', { token })
        .then(response => {
            if (response.data.success) {
                if (response.data.images) {
                    setFavourites(response.data.images);
                }
                else {
                    navigate('/login');
                }
            }
            else {
                navigate('/login');
            }
        })
      .catch(error => {
        console.error('Error:', error);
        navigate('/login');
      });
      } catch (error) {
        navigate('/login');
      }
    };

    fetchFavourites();
  }, []);

  return (
    <>
      <div className='FavouritesH1'>
        Your Favorite Astropictures
      </div>
      <hr />
      <div className='FavouritesDiv1'>
        <div className='FavouritesDiv2'>
          {favourites.map((favourite, index) => (
            <Link
            to={`/?date=${new Date(favourite.date).toISOString().split('T')[0]}`}
            className='FavouritesDivs'
            key={index}
          >
              <img src={favourite.image} className="FavouriteDivImg" alt="Favourite Image" />
              <div className='FavouriteDivDate'>{new Date(favourite.date).toISOString().split('T')[0]}</div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Favourites;
