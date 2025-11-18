/**
 * Testy jednostkowe dla modułu Storage
 * Testuje wszystkie operacje CRUD oraz edge cases związane z localStorage
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Symulacja importu modułu Storage z app.js
// W produkcji należałoby zrefaktoryzować app.js do modułów ES6
const APP_CONFIG = {
  name: 'INOVIT e-Segregator',
  version: '1.0.0',
  storagePrefix: 'inovit_esegregator_',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: 'HH:mm'
};

const Storage = {
  save(key, data) {
    try {
      const fullKey = APP_CONFIG.storagePrefix + key;
      const jsonData = JSON.stringify(data);
      localStorage.setItem(fullKey, jsonData);
      return true;
    } catch (error) {
      console.error('Błąd zapisu do localStorage:', error);
      return false;
    }
  },

  load(key) {
    try {
      const fullKey = APP_CONFIG.storagePrefix + key;
      const jsonData = localStorage.getItem(fullKey);
      return jsonData ? JSON.parse(jsonData) : null;
    } catch (error) {
      console.error('Błąd odczytu z localStorage:', error);
      return null;
    }
  },

  remove(key) {
    try {
      const fullKey = APP_CONFIG.storagePrefix + key;
      localStorage.removeItem(fullKey);
      return true;
    } catch (error) {
      console.error('Błąd usuwania z localStorage:', error);
      return false;
    }
  },

  clearAll() {
    try {
      const keys = [];
      // Iteruj przez localStorage używając length i key()
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(APP_CONFIG.storagePrefix)) {
          keys.push(key);
        }
      }
      // Usuń znalezione klucze
      keys.forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Błąd czyszczenia localStorage:', error);
      return false;
    }
  },

  getAllKeys() {
    const keys = [];
    // Iteruj przez localStorage używając length i key()
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(APP_CONFIG.storagePrefix)) {
        keys.push(key.replace(APP_CONFIG.storagePrefix, ''));
      }
    }
    return keys;
  }
};

describe('Storage Module - Moduł Storage', () => {

  beforeEach(() => {
    // Wyczyść localStorage przed każdym testem
    localStorage.clear();
    // Wyczyść wszystkie moki
    vi.clearAllMocks();
  });

  describe('save() - Zapisywanie danych', () => {

    it('powinien zapisać proste dane do localStorage z odpowiednim prefiksem', () => {
      const testData = { name: 'Test', value: 123 };
      const result = Storage.save('testKey', testData);

      expect(result).toBe(true);
      expect(localStorage.getItem('inovit_esegregator_testKey')).toBe(JSON.stringify(testData));
    });

    it('powinien zapisać złożone obiekty z zagnieżdżonymi danymi', () => {
      const complexData = {
        facility: {
          name: 'Zakład Spożywczy XYZ',
          address: {
            street: 'ul. Testowa 123',
            city: 'Warszawa',
            postal: '00-001'
          },
          employees: ['Jan Kowalski', 'Anna Nowak']
        },
        metadata: {
          created: '2025-01-15',
          version: '1.0'
        }
      };

      const result = Storage.save('facility', complexData);

      expect(result).toBe(true);
      const saved = JSON.parse(localStorage.getItem('inovit_esegregator_facility'));
      expect(saved).toEqual(complexData);
      expect(saved.facility.address.city).toBe('Warszawa');
    });

    it('powinien zapisać tablicę obiektów', () => {
      const arrayData = [
        { id: 1, name: 'Wpis 1', temperature: 4.5 },
        { id: 2, name: 'Wpis 2', temperature: 5.2 },
        { id: 3, name: 'Wpis 3', temperature: 3.8 }
      ];

      const result = Storage.save('registry_temperature', arrayData);

      expect(result).toBe(true);
      const saved = JSON.parse(localStorage.getItem('inovit_esegregator_registry_temperature'));
      expect(saved).toEqual(arrayData);
      expect(saved.length).toBe(3);
    });

    it('powinien zapisać puste obiekty i tablice', () => {
      expect(Storage.save('emptyObject', {})).toBe(true);
      expect(Storage.save('emptyArray', [])).toBe(true);

      expect(localStorage.getItem('inovit_esegregator_emptyObject')).toBe('{}');
      expect(localStorage.getItem('inovit_esegregator_emptyArray')).toBe('[]');
    });

    it('powinien zapisać wartości null jako JSON', () => {
      Storage.save('nullValue', null);

      expect(localStorage.getItem('inovit_esegregator_nullValue')).toBe('null');
    });

    it('powinien obsłużyć undefined - JSON.stringify zwraca undefined', () => {
      // JSON.stringify(undefined) zwraca undefined (nie string)
      // Więc localStorage.setItem nie zapisuje tej wartości
      Storage.save('undefinedValue', undefined);

      // W zależności od implementacji przeglądarki, może być null lub undefined
      const result = localStorage.getItem('inovit_esegregator_undefinedValue');
      expect(result === null || result === undefined || result === 'undefined').toBe(true);
    });

    it('powinien zapisać dane z polskimi znakami', () => {
      const polishData = {
        nazwa: 'Zakład Produkcji Żywności',
        opis: 'Specjalizacja: pieczywo, ciastka, ciasta'
      };

      Storage.save('polish', polishData);
      const saved = JSON.parse(localStorage.getItem('inovit_esegregator_polish'));

      expect(saved.nazwa).toBe('Zakład Produkcji Żywności');
      expect(saved.opis).toContain('pieczywo');
    });

    it('powinien nadpisać istniejące dane tym samym kluczem', () => {
      Storage.save('overwrite', { value: 'old' });
      Storage.save('overwrite', { value: 'new' });

      const saved = JSON.parse(localStorage.getItem('inovit_esegregator_overwrite'));
      expect(saved.value).toBe('new');
    });

    it('powinien zwrócić false przy błędzie zapisu (QuotaExceededError)', () => {
      // Mockujemy localStorage.setItem aby rzucił błąd
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new DOMException('QuotaExceededError');
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = Storage.save('testKey', { data: 'test' });

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Błąd zapisu do localStorage:',
        expect.any(DOMException)
      );

      // Przywróć oryginalną implementację
      localStorage.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });
  });

  describe('load() - Odczytywanie danych', () => {

    it('powinien odczytać zapisane dane z localStorage', () => {
      const testData = { name: 'Test', value: 456 };
      localStorage.setItem('inovit_esegregator_testKey', JSON.stringify(testData));

      const loaded = Storage.load('testKey');

      expect(loaded).toEqual(testData);
      expect(loaded.name).toBe('Test');
      expect(loaded.value).toBe(456);
    });

    it('powinien zwrócić null gdy klucz nie istnieje', () => {
      const loaded = Storage.load('nonExistentKey');

      expect(loaded).toBeNull();
    });

    it('powinien odczytać złożone obiekty z zagnieżdżonymi danymi', () => {
      const complexData = {
        registry: [
          { id: 1, temperature: 4.2, date: '2025-01-15' },
          { id: 2, temperature: 5.1, date: '2025-01-16' }
        ]
      };
      localStorage.setItem('inovit_esegregator_complex', JSON.stringify(complexData));

      const loaded = Storage.load('complex');

      expect(loaded.registry).toHaveLength(2);
      expect(loaded.registry[0].temperature).toBe(4.2);
    });

    it('powinien odczytać puste obiekty i tablice', () => {
      localStorage.setItem('inovit_esegregator_emptyObj', '{}');
      localStorage.setItem('inovit_esegregator_emptyArr', '[]');

      expect(Storage.load('emptyObj')).toEqual({});
      expect(Storage.load('emptyArr')).toEqual([]);
    });

    it('powinien zwrócić null przy nieprawidłowym JSON', () => {
      localStorage.setItem('inovit_esegregator_invalid', '{invalid json}');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const loaded = Storage.load('invalid');

      expect(loaded).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('powinien odczytać null jako wartość', () => {
      localStorage.setItem('inovit_esegregator_nullValue', 'null');

      const loaded = Storage.load('nullValue');

      expect(loaded).toBeNull();
    });

    it('powinien obsłużyć dane z polskimi znakami', () => {
      const polishData = { tekst: 'Łódź, Wrocław, Gdańsk' };
      localStorage.setItem('inovit_esegregator_polish', JSON.stringify(polishData));

      const loaded = Storage.load('polish');

      expect(loaded.tekst).toBe('Łódź, Wrocław, Gdańsk');
    });
  });

  describe('remove() - Usuwanie danych', () => {

    it('powinien usunąć istniejący klucz z localStorage', () => {
      localStorage.setItem('inovit_esegregator_toRemove', JSON.stringify({ data: 'test' }));

      const result = Storage.remove('toRemove');

      expect(result).toBe(true);
      expect(localStorage.getItem('inovit_esegregator_toRemove')).toBeNull();
    });

    it('powinien zwrócić true nawet gdy klucz nie istnieje', () => {
      const result = Storage.remove('nonExistent');

      expect(result).toBe(true);
    });

    it('powinien usunąć tylko wskazany klucz, nie wpływając na inne', () => {
      localStorage.setItem('inovit_esegregator_key1', '{"data": "1"}');
      localStorage.setItem('inovit_esegregator_key2', '{"data": "2"}');
      localStorage.setItem('inovit_esegregator_key3', '{"data": "3"}');

      Storage.remove('key2');

      expect(localStorage.getItem('inovit_esegregator_key1')).toBeTruthy();
      expect(localStorage.getItem('inovit_esegregator_key2')).toBeNull();
      expect(localStorage.getItem('inovit_esegregator_key3')).toBeTruthy();
    });

    it('powinien zwrócić false przy błędzie usuwania', () => {
      const originalRemoveItem = localStorage.removeItem;
      localStorage.removeItem = vi.fn(() => {
        throw new Error('Storage error');
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = Storage.remove('testKey');

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();

      localStorage.removeItem = originalRemoveItem;
      consoleSpy.mockRestore();
    });
  });

  describe('clearAll() - Czyszczenie wszystkich danych aplikacji', () => {

    beforeEach(() => {
      // Reset mocków przed każdym testem w tej grupie
      localStorage.clear();
    });

    it('powinien wyczyścić tylko klucze aplikacji z odpowiednim prefiksem', () => {
      // Dodaj klucze aplikacji
      localStorage.setItem('inovit_esegregator_facility', '{"name": "Test"}');
      localStorage.setItem('inovit_esegregator_registry_temp', '[1,2,3]');
      localStorage.setItem('inovit_esegregator_settings', '{"theme": "dark"}');

      // Dodaj klucze innych aplikacji (nie powinny być usunięte)
      localStorage.setItem('other_app_data', '{"data": "should remain"}');
      localStorage.setItem('user_preferences', '{"lang": "pl"}');

      const result = Storage.clearAll();

      expect(result).toBe(true);
      expect(localStorage.getItem('inovit_esegregator_facility')).toBeNull();
      expect(localStorage.getItem('inovit_esegregator_registry_temp')).toBeNull();
      expect(localStorage.getItem('inovit_esegregator_settings')).toBeNull();

      // Klucze innych aplikacji powinny pozostać
      expect(localStorage.getItem('other_app_data')).toBe('{"data": "should remain"}');
      expect(localStorage.getItem('user_preferences')).toBe('{"lang": "pl"}');
    });

    it('powinien działać poprawnie gdy localStorage jest pusty', () => {
      const result = Storage.clearAll();

      expect(result).toBe(true);
    });

    it('powinien działać poprawnie gdy nie ma kluczy aplikacji', () => {
      localStorage.setItem('other_app_1', 'data1');
      localStorage.setItem('other_app_2', 'data2');

      const result = Storage.clearAll();

      expect(result).toBe(true);
      expect(localStorage.getItem('other_app_1')).toBe('data1');
      expect(localStorage.getItem('other_app_2')).toBe('data2');
    });

    it('powinien wyczyścić wiele kluczy aplikacji jednocześnie', () => {
      // Dodaj 10 różnych kluczy
      for (let i = 0; i < 10; i++) {
        localStorage.setItem(`inovit_esegregator_key${i}`, JSON.stringify({ id: i }));
      }

      Storage.clearAll();

      for (let i = 0; i < 10; i++) {
        expect(localStorage.getItem(`inovit_esegregator_key${i}`)).toBeNull();
      }
    });

    // Test obsługi błędów jest trudny do zaimplementowania w środowisku testowym
    // ponieważ localStorage w happy-dom nie pozwala na mockowanie propertyów
    // Obsługa błędów jest już testowana w innych metodach (save, load, remove)
  });

  describe('getAllKeys() - Pobieranie wszystkich kluczy aplikacji', () => {

    it('powinien zwrócić pustą tablicę gdy brak kluczy aplikacji', () => {
      const keys = Storage.getAllKeys();

      expect(keys).toEqual([]);
      expect(Array.isArray(keys)).toBe(true);
    });

    it('powinien zwrócić wszystkie klucze aplikacji bez prefiksu', () => {
      localStorage.setItem('inovit_esegregator_facility', '{}');
      localStorage.setItem('inovit_esegregator_registry_temp', '[]');
      localStorage.setItem('inovit_esegregator_settings', '{}');

      const keys = Storage.getAllKeys();

      expect(keys).toHaveLength(3);
      expect(keys).toContain('facility');
      expect(keys).toContain('registry_temp');
      expect(keys).toContain('settings');

      // Nie powinny zawierać prefiksu
      expect(keys.some(key => key.startsWith('inovit_esegregator_'))).toBe(false);
    });

    it('powinien ignorować klucze innych aplikacji', () => {
      localStorage.setItem('inovit_esegregator_mykey', '{}');
      localStorage.setItem('other_app_key', '{}');
      localStorage.setItem('random_data', '{}');

      const keys = Storage.getAllKeys();

      expect(keys).toEqual(['mykey']);
      expect(keys).not.toContain('other_app_key');
      expect(keys).not.toContain('random_data');
    });

    it('powinien działać z wieloma kluczami aplikacji', () => {
      const expectedKeys = [];
      for (let i = 0; i < 20; i++) {
        const key = `registry_${i}`;
        expectedKeys.push(key);
        localStorage.setItem(`inovit_esegregator_${key}`, '[]');
      }

      const keys = Storage.getAllKeys();

      expect(keys).toHaveLength(20);
      expectedKeys.forEach(expectedKey => {
        expect(keys).toContain(expectedKey);
      });
    });

    it('powinien zwrócić klucze z polskimi znakami', () => {
      localStorage.setItem('inovit_esegregator_rejestr_łódź', '{}');
      localStorage.setItem('inovit_esegregator_zakład_gdańsk', '{}');

      const keys = Storage.getAllKeys();

      expect(keys).toContain('rejestr_łódź');
      expect(keys).toContain('zakład_gdańsk');
    });
  });

  describe('Testy integracyjne - pełny cykl CRUD', () => {

    it('powinien wykonać pełny cykl: save -> load -> remove', () => {
      const testData = { facility: 'Zakład XYZ', created: '2025-01-15' };

      // Save
      const saveResult = Storage.save('facility', testData);
      expect(saveResult).toBe(true);

      // Load
      const loadedData = Storage.load('facility');
      expect(loadedData).toEqual(testData);

      // Remove
      const removeResult = Storage.remove('facility');
      expect(removeResult).toBe(true);

      // Verify removal
      const afterRemove = Storage.load('facility');
      expect(afterRemove).toBeNull();
    });

    it('powinien zarządzać wieloma rejestrami jednocześnie', () => {
      const registries = {
        temperature: [{ id: 1, temp: 4.5 }],
        hygiene: [{ id: 1, area: 'Kitchen' }],
        pests: [{ id: 1, type: 'None' }]
      };

      // Zapisz wszystkie rejestry
      Object.entries(registries).forEach(([name, data]) => {
        Storage.save(`registry_${name}`, data);
      });

      // Sprawdź że wszystkie są zapisane
      const keys = Storage.getAllKeys();
      expect(keys).toContain('registry_temperature');
      expect(keys).toContain('registry_hygiene');
      expect(keys).toContain('registry_pests');

      // Odczytaj i sprawdź
      expect(Storage.load('registry_temperature')).toEqual(registries.temperature);
      expect(Storage.load('registry_hygiene')).toEqual(registries.hygiene);
      expect(Storage.load('registry_pests')).toEqual(registries.pests);

      // Wyczyść wszystko
      Storage.clearAll();
      expect(Storage.getAllKeys()).toHaveLength(0);
    });

    it('powinien obsłużyć nadpisywanie i aktualizację danych', () => {
      // Początkowe dane
      Storage.save('facility', { name: 'Old Name', version: 1 });

      // Pierwsza aktualizacja
      Storage.save('facility', { name: 'New Name', version: 2 });
      let loaded = Storage.load('facility');
      expect(loaded.name).toBe('New Name');
      expect(loaded.version).toBe(2);

      // Druga aktualizacja
      Storage.save('facility', { name: 'Final Name', version: 3, active: true });
      loaded = Storage.load('facility');
      expect(loaded.name).toBe('Final Name');
      expect(loaded.version).toBe(3);
      expect(loaded.active).toBe(true);
    });
  });

  describe('Edge cases i przypadki brzegowe', () => {

    it('powinien obsłużyć bardzo długie klucze', () => {
      const longKey = 'a'.repeat(1000);
      const result = Storage.save(longKey, { test: 'data' });

      expect(result).toBe(true);
      expect(Storage.load(longKey)).toEqual({ test: 'data' });
    });

    it('powinien obsłużyć duże ilości danych', () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        timestamp: Date.now(),
        data: `Entry number ${i}`,
        values: [i, i * 2, i * 3]
      }));

      const result = Storage.save('largeData', largeArray);
      expect(result).toBe(true);

      const loaded = Storage.load('largeData');
      expect(loaded).toHaveLength(1000);
      expect(loaded[500].id).toBe(500);
    });

    it('powinien obsłużyć znaki specjalne w kluczach', () => {
      const specialKeys = [
        'key-with-dash',
        'key_with_underscore',
        'key.with.dots',
        'key:with:colons'
      ];

      specialKeys.forEach(key => {
        Storage.save(key, { key });
        const loaded = Storage.load(key);
        expect(loaded.key).toBe(key);
      });
    });

    it('powinien obsłużyć dane z różnymi typami wartości', () => {
      const mixedData = {
        string: 'text',
        number: 42,
        float: 3.14,
        boolean: true,
        nullValue: null,
        array: [1, 2, 3],
        object: { nested: 'value' },
        emptyString: '',
        zero: 0,
        negativeNumber: -100
      };

      Storage.save('mixed', mixedData);
      const loaded = Storage.load('mixed');

      expect(loaded).toEqual(mixedData);
      expect(typeof loaded.string).toBe('string');
      expect(typeof loaded.number).toBe('number');
      expect(typeof loaded.boolean).toBe('boolean');
      expect(loaded.nullValue).toBeNull();
      expect(Array.isArray(loaded.array)).toBe(true);
    });

    it('powinien obsłużyć Unicode i emoji', () => {
      const unicodeData = {
        emoji: '🍕🍔🥗',
        chinese: '你好世界',
        arabic: 'مرحبا بالعالم',
        polish: 'Zażółć gęślą jaźń'
      };

      Storage.save('unicode', unicodeData);
      const loaded = Storage.load('unicode');

      expect(loaded).toEqual(unicodeData);
    });
  });
});
