/**
 * Postal Code City Utility Functions
 * 
 * Ezek az un-opinionated utility függvények közvetlenül használhatóak
 * anélkül, hogy React hook-okra lenne szükség.
 */

import axios from 'axios';

const API_URL = 'http://localhost:5175/api/PostalCodeCity/autoFillPCC';

/**
 * Város keresése irányítószám alapján
 * @param {string|number} postalCode - Az irányítószám
 * @returns {Promise<Object>} Az API választ (iranyitoszam, telepules)
 */
export const getCityFromPostalCode = async (postalCode) => {
    if (!postalCode) {
        throw new Error('Az irányítószám megadása kötelező.');
    }

    try {
        const response = await axios.post(API_URL, {
            postalCode: parseInt(postalCode),
            city: ""
        });

        if (response.status === 200 && response.data) {
            return response.data;
        }
        throw new Error('Ismeretlen válasz az API-ról');
    } catch (error) {
        const errorMessage = error.response?.data || error.message || 'Az irányítószám nem található.';
        throw new Error(errorMessage);
    }
};

/**
 * Irányítószám keresése város alapján
 * @param {string} city - A város neve
 * @returns {Promise<Object>} Az API választ (iranyitoszam, telepules)
 */
export const getPostalCodeFromCity = async (city) => {
    if (!city) {
        throw new Error('A város megadása kötelező.');
    }

    try {
        const response = await axios.post(API_URL, {
            postalCode: 0,
            city: city
        });

        if (response.status === 200 && response.data) {
            return response.data;
        }
        throw new Error('Ismeretlen válasz az API-ról');
    } catch (error) {
        const errorMessage = error.response?.data || error.message || 'A város nem található.';
        throw new Error(errorMessage);
    }
};

/**
 * Város automatikus kitöltése egy input mezőbe irányítószám alapján
 * @param {string|number} postalCode - Az irányítószám
 * @param {string} cityInputId - A város input elem ID-je
 * @param {function} onError - Opcionális hiba kezelő callback
 * @returns {Promise<Object>}
 */
export const autoFillCityFromPostalCode = async (postalCode, cityInputId, onError = null) => {
    try {
        const data = await getCityFromPostalCode(postalCode);
        
        const cityInput = document.getElementById(cityInputId);
        if (cityInput && data.telepules) {
            cityInput.value = data.telepules;
        }
        
        return data;
    } catch (error) {
        const cityInput = document.getElementById(cityInputId);
        if (cityInput) {
            cityInput.value = "";
        }
        
        if (onError) {
            onError(error.message);
        }
        
        throw error;
    }
};

/**
 * Irányítószám automatikus kitöltése egy input mezőbe város alapján
 * @param {string} city - A város neve
 * @param {string} postalCodeInputId - Az irányítószám input elem ID-je
 * @param {function} onError - Opcionális hiba kezelő callback
 * @returns {Promise<Object>}
 */
export const autoFillPostalCodeFromCity = async (city, postalCodeInputId, onError = null) => {
    try {
        const data = await getPostalCodeFromCity(city);
        
        const postalCodeInput = document.getElementById(postalCodeInputId);
        if (postalCodeInput && data.iranyitoszam) {
            postalCodeInput.value = data.iranyitoszam;
        }
        
        return data;
    } catch (error) {
        const postalCodeInput = document.getElementById(postalCodeInputId);
        if (postalCodeInput) {
            postalCodeInput.value = "";
        }
        
        if (onError) {
            onError(error.message);
        }
        
        throw error;
    }
};
