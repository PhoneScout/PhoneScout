import { useCallback } from 'react';
import axios from 'axios';

/**
 * Custom hook az irányítószám-város automatikus kitöltéshez
 * @param {Object} options - Beállítások
 * @param {string} options.postalCodeInputId - Az irányítószám input elem ID-je
 * @param {string} options.cityInputId - A város input elem ID-je
 * @param {function} options.onError - Hiba kezelő callback
 * @returns {Object} { fetchCityFromPostalCode, loading, error }
 */
export const usePostalCodeCity = ({ postalCodeInputId, cityInputId, onError }) => {
    const fetchCityFromPostalCode = useCallback(async (postalCode) => {
        if (!postalCode || postalCode === "") {
            // Ha üres az irányítószám, töröljük a város mezőt
            const cityInput = document.getElementById(cityInputId);
            if (cityInput) {
                cityInput.value = "";
            }
            return null;
        }

        try {
            const response = await axios.post('http://localhost:5175/api/PostalCodeCity/autoFillPCC', {
                postalCode: parseInt(postalCode),
                city: ""
            });

            if (response.status === 200 && response.data) {
                // Kitöltjük a város mezőt
                const cityInput = document.getElementById(cityInputId);
                if (cityInput && response.data.telepules) {
                    cityInput.value = response.data.telepules;
                }
                return response.data;
            }
        } catch (error) {
            const errorMessage = error.response?.data || 'Az irányítószám nem található.';
            if (onError) {
                onError(errorMessage);
            }
            // Töröljük a város mezőt hiba esetén
            const cityInput = document.getElementById(cityInputId);
            if (cityInput) {
                cityInput.value = "";
            }
            throw error;
        }
    }, [cityInputId, onError]);

    return { fetchCityFromPostalCode };
};

/**
 * Alternatív verzió: megfelelő függvény, amely közvetlenül használható
 * @deprecated Helyette a usePostalCodeCity hook-ot ajánljuk
 */
export const fetchCityFromPostalCode = async (postalCode, cityInputId) => {
    if (!postalCode || postalCode === "") {
        const cityInput = document.getElementById(cityInputId);
        if (cityInput) {
            cityInput.value = "";
        }
        return null;
    }

    try {
        const response = await axios.post('http://localhost:5175/api/PostalCodeCity/autoFillPCC', {
            postalCode: parseInt(postalCode),
            city: ""
        });

        if (response.status === 200 && response.data) {
            const cityInput = document.getElementById(cityInputId);
            if (cityInput && response.data.telepules) {
                cityInput.value = response.data.telepules;
            }
            return response.data;
        }
    } catch (error) {
        const cityInput = document.getElementById(cityInputId);
        if (cityInput) {
            cityInput.value = "";
        }
        throw error;
    }
};
