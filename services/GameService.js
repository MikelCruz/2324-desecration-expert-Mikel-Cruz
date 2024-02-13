// GameService.js

import axios from 'axios';

const getData = async () => {
  try {
    const SuperPeopleAPI = "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json";
    const response = await axios.get(SuperPeopleAPI);
    return response.data; // Devuelve los datos reales obtenidos de la API
  } catch (error) {
    throw error;
  }
};

export default { getData };
