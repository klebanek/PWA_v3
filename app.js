/**
 * INOVIT e-Segregator - Główny plik aplikacji
 * System zarządzania dokumentacją HACCP
 */

// === KONFIGURACJA ===
const APP_CONFIG = {
  name: 'INOVIT e-Segregator',
  version: '1.0.0',
  storagePrefix: 'inovit_esegregator_',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: 'HH:mm'
};

// === ZARZĄDZANIE DANYMI W LOCALSTORAGE ===
const Storage = {
  /**
   * Zapisuje dane do localStorage
   */
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

  /**
   * Odczytuje dane z localStorage
   */
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

  /**
   * Usuwa dane z localStorage
   */
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

  /**
   * Czyści wszystkie dane aplikacji
   */
  clearAll() {
    try {
      const keys = [];
      // Iteruj przez localStorage używając length i key()
      // Ta metoda działa zarówno w przeglądarkach jak i w środowiskach testowych
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

  /**
   * Zwraca wszystkie klucze aplikacji
   */
  getAllKeys() {
    const keys = [];
    // Iteruj przez localStorage używając length i key()
    // Ta metoda działa zarówno w przeglądarkach jak i w środowiskach testowych
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(APP_CONFIG.storagePrefix)) {
        keys.push(key.replace(APP_CONFIG.storagePrefix, ''));
      }
    }
    return keys;
  }
};

// === POMOCNICZE FUNKCJE DATY I CZASU ===
const DateTime = {
  /**
   * Zwraca aktualną datę w formacie YYYY-MM-DD
   */
  getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * Zwraca aktualny czas w formacie HH:mm
   */
  getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  },

  /**
   * Zwraca pełną datę i czas
   */
  getCurrentDateTime() {
    return `${this.getCurrentDate()} ${this.getCurrentTime()}`;
  },

  /**
   * Formatuje datę do polskiego formatu
   */
  formatDatePL(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  },

  /**
   * Zwraca timestamp
   */
  getTimestamp() {
    return Date.now();
  }
};

// === ZARZĄDZANIE ZAKŁADEM ===
const Facility = {
  /**
   * Zapisuje dane zakładu
   */
  save(data) {
    const facilityData = {
      ...data,
      lastUpdated: DateTime.getCurrentDateTime(),
      timestamp: DateTime.getTimestamp()
    };
    return Storage.save('facility', facilityData);
  },

  /**
   * Pobiera dane zakładu
   */
  load() {
    return Storage.load('facility');
  },

  /**
   * Sprawdza czy dane zakładu istnieją
   */
  exists() {
    return this.load() !== null;
  }
};

// === ZARZĄDZANIE REJESTRAMI ===
const Registry = {
  /**
   * Dodaje wpis do rejestru
   */
  addEntry(registryName, entry) {
    const entries = this.getEntries(registryName) || [];
    const newEntry = {
      id: DateTime.getTimestamp(),
      timestamp: DateTime.getCurrentDateTime(),
      ...entry
    };
    entries.push(newEntry);
    return Storage.save(`registry_${registryName}`, entries);
  },

  /**
   * Pobiera wszystkie wpisy z rejestru
   */
  getEntries(registryName) {
    return Storage.load(`registry_${registryName}`);
  },

  /**
   * Usuwa wpis z rejestru
   */
  removeEntry(registryName, entryId) {
    const entries = this.getEntries(registryName) || [];
    const filtered = entries.filter(entry => entry.id !== entryId);
    return Storage.save(`registry_${registryName}`, filtered);
  },

  /**
   * Aktualizuje wpis w rejestrze
   */
  updateEntry(registryName, entryId, updatedData) {
    const entries = this.getEntries(registryName) || [];
    const index = entries.findIndex(entry => entry.id === entryId);
    if (index !== -1) {
      entries[index] = {
        ...entries[index],
        ...updatedData,
        lastUpdated: DateTime.getCurrentDateTime()
      };
      return Storage.save(`registry_${registryName}`, entries);
    }
    return false;
  },

  /**
   * Czyści cały rejestr
   */
  clearRegistry(registryName) {
    return Storage.remove(`registry_${registryName}`);
  }
};

// === EKSPORT DANYCH ===
const Export = {
  /**
   * Eksportuje dane do JSON
   */
  toJSON(data, filename = 'export') {
    try {
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      this.downloadBlob(blob, `${filename}.json`);
      return true;
    } catch (error) {
      console.error('Błąd eksportu JSON:', error);
      return false;
    }
  },

  /**
   * Eksportuje dane do CSV
   */
  toCSV(data, filename = 'export') {
    try {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Dane muszą być niepustą tablicą');
      }

      // Nagłówki
      const headers = Object.keys(data[0]);
      let csv = headers.join(';') + '\n';

      // Wiersze danych
      data.forEach(row => {
        const values = headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(';')
            ? `"${value}"`
            : value;
        });
        csv += values.join(';') + '\n';
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      this.downloadBlob(blob, `${filename}.csv`);
      return true;
    } catch (error) {
      console.error('Błąd eksportu CSV:', error);
      return false;
    }
  },

  /**
   * Pomocnicza funkcja do pobierania pliku
   */
  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Eksportuje wszystkie dane aplikacji
   */
  exportAll() {
    const allData = {
      exportDate: DateTime.getCurrentDateTime(),
      version: APP_CONFIG.version,
      facility: Facility.load(),
      registries: {}
    };

    // Pobierz wszystkie rejestry
    const keys = Storage.getAllKeys();
    keys.forEach(key => {
      if (key.startsWith('registry_')) {
        const registryName = key.replace('registry_', '');
        allData.registries[registryName] = Storage.load(key);
      }
    });

    return this.toJSON(allData, `inovit_backup_${DateTime.getCurrentDate()}`);
  }
};

// === IMPORT DANYCH ===
const Import = {
  /**
   * Importuje dane z pliku JSON
   */
  fromJSON(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        callback(true, data);
      } catch (error) {
        console.error('Błąd importu JSON:', error);
        callback(false, null);
      }
    };
    reader.onerror = () => {
      callback(false, null);
    };
    reader.readAsText(file);
  },

  /**
   * Importuje pełny backup
   */
  importBackup(data) {
    try {
      if (data.facility) {
        Facility.save(data.facility);
      }
      if (data.registries) {
        Object.keys(data.registries).forEach(registryName => {
          Storage.save(`registry_${registryName}`, data.registries[registryName]);
        });
      }
      return true;
    } catch (error) {
      console.error('Błąd importu backupu:', error);
      return false;
    }
  }
};

// === POWIADOMIENIA ===
const Notifications = {
  /**
   * Pokazuje powiadomienie sukcesu
   */
  success(message) {
    this.show(message, 'success');
  },

  /**
   * Pokazuje powiadomienie błędu
   */
  error(message) {
    this.show(message, 'error');
  },

  /**
   * Pokazuje powiadomienie informacyjne
   */
  info(message) {
    this.show(message, 'info');
  },

  /**
   * Wyświetla powiadomienie
   */
  show(message, type = 'info') {
    // Sprawdź czy istnieje kontener na powiadomienia
    let container = document.getElementById('notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
      `;
      document.body.appendChild(container);
    }

    // Utwórz powiadomienie
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    const colors = {
      success: '#28a745',
      error: '#dc3545',
      info: '#007380'
    };

    notification.style.cssText = `
      background-color: ${colors[type] || colors.info};
      color: white;
      padding: 15px 20px;
      margin-bottom: 10px;
      border-radius: 5px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      min-width: 250px;
      animation: slideIn 0.3s ease;
    `;

    container.appendChild(notification);

    // Auto-usuwanie po 3 sekundach
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        container.removeChild(notification);
      }, 300);
    }, 3000);
  }
};

// Dodaj style animacji
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// === INICJALIZACJA ===
console.log(`${APP_CONFIG.name} v${APP_CONFIG.version} załadowany`);

// Eksport globalny dla łatwego dostępu
window.InovitApp = {
  Storage,
  DateTime,
  Facility,
  Registry,
  Export,
  Import,
  Notifications,
  APP_CONFIG
};
