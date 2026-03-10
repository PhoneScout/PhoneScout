# Tesztelési útmutató - PhoneScout Frontend

## Mit tesztelünk?

Ebben a projektben 4 fő komponenshez készültek tesztek:

### 1. **PhoneCard.test.jsx** - Telefon kártya komponens
- **API hívás tesztelése**: Betölti-e a telefon képét az `/api/blob/GetIndex/{id}` végpontról
- **Megjelenítés**: Helyesen jeleníti-e meg a telefon nevét és árát
- **Raktárkészlet**: Megfelelően mutatja-e a "Raktáron" / "Nincs raktáron" státuszt
- **Hibakezelés**: Kezeli-e a kép betöltési hibákat

### 2. **Login.test.jsx** - Bejelentkezési komponens
- **Form validáció**: Ellenőrzi, hogy kitöltött mezőkkel működik-e
- **Hibaüzenetek**: Megjeleníti-e a megfelelő hibákat (üres mezők, hibás email, hálózati hiba)
- **Sikeres login**: Meghívja-e az API-t és navigál-e sikeres bejelentkezés után
- **Salt lekérés**: Helyesen kéri-e le a salt-ot a jelszó hash-eléséhez

### 3. **Home.test.jsx** - Főoldal komponens
- **Telefonok betöltése**: GET kérés után megjelennek-e a telefonok
- **Események betöltése**: Lekérdezi-e az eseményeket az API-ból
- **Több API hívás**: Mindkét végpontot meghívja-e (`/mainPage` és `/api/event`)
- **Üres lista kezelése**: Helyesen működik-e, ha nincs adat
- **Hibakezelés**: Kezeli-e az API hibákat

### 4. **AuthContext.test.jsx** - Autentikációs kontextus
- **Token kezelés**: LocalStorage-ba menti és onnan betölti-e a tokent
- **Login függvény**: Beállítja-e a tokent a kontextusban
- **Logout függvény**: Törli-e a tokent
- **Kontextus megosztás**: Elérhető-e minden komponensben az useAuth hook

## Hogyan futtasd a teszteket?

### Tesztek futtatása
```bash
npm test
```

### Tesztek futtatása watch módban (automatikus újrafuttatás fájl mentéskor)
```bash
npm test -- --watch
```

### Tesztek futtatása UI-val
```bash
npm run test:ui
```

### Egy konkrét teszt fájl futtatása
```bash
npm test PhoneCard.test.jsx
```

### Coverage report készítése
```bash
npm test -- --coverage
```

## Mire figyelj a tesztekben?

### 1. **Mock-olás (Hamis adatok)**
A példában is láthatod, hogy a tanár `vi.mock()` segítségével "meghamisítja" az axios-t:

```javascript
vi.mock("axios");

axios.get.mockResolvedValueOnce({
  data: [/* adatok */]
});
```

**Miért?** Mert nem akarjuk ténylegesen meghívni a szervert minden tesztnél - gyorsabb és megbízhatóbb így.

### 2. **Komponens mockolás**
Néha más komponenseket is mock-olunk:

```javascript
vi.mock("../components/PhoneCard", () => ({
  default: function MockPhoneCard({ phoneName }) {
    return <div>{phoneName}</div>;
  }
}));
```

**Miért?** A Home tesztben csak arra vagyunk kíváncsiak, hogy a Home komponens betölti-e az adatokat, nem arra, hogy a PhoneCard hogyan jelenik meg.

### 3. **Várakozás aszinkron műveletekre**
Az API hívások időt vesznek igénybe, ezért `waitFor` használunk:

```javascript
await waitFor(() => {
  expect(screen.findByText("Samsung Galaxy S24")).toBeInTheDocument();
});
```

### 4. **LocalStorage tisztítása**
A `beforeEach` blokkban mindig tisztítjuk:

```javascript
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});
```

**Miért?** Hogy a tesztek ne befolyásolják egymást.

## Teszt szerkezet magyarázat

```javascript
test("megjelenít egy adott telefont a GET kérés után", async () => {
  // 1. ARRANGE - Előkészítés
  axios.get.mockResolvedValueOnce({ data: [...] });

  // 2. ACT - Végrehajtás
  render(<PhoneCard />);

  // 3. ASSERT - Ellenőrzés
  expect(await screen.findByText("Samsung Galaxy S24")).toBeInTheDocument();
});
```

## Gyakori assert-ek (ellenőrzések)

- `expect(element).toBeInTheDocument()` - Az elem megjelenik-e a DOM-ban
- `expect(element).toHaveTextContent("szöveg")` - Van-e ilyen szövege
- `expect(mockFn).toHaveBeenCalled()` - Meghívták-e a függvényt
- `expect(mockFn).toHaveBeenCalledWith(...)` - Megfelelő paraméterekkel hívták-e

## További tesztek írásához

Ha további komponensekhez szeretnél teszteket írni, kövesd ezt a mintát:
1. Mock-old az axios-t és más külső függőségeket
2. Renderd a komponenst
3. Teszteld az alapvető megjelenítést
4. Teszteld az API hívásokat
5. Teszteld a felhasználói interakciókat (kattintások, input mezők)
6. Teszteld a hibakezelést
