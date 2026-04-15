A rendszer elindításának folyamata
A rendszer teljes körű működéséhez mind a backend (API), mind a frontend szolgálta-
tások elindítása szükséges.

Backend indítása
– A backend mappába történő navigálás terminál segítségével:
cd .\backend\PhoneScout_GitHub\
– A backend szolgáltatás indítása: dotnet run .\PhoneScout_GitHub.csproj
– Sikeres indítást követően a Swagger felület a http ://localhost :5175/swagger
címen érhető el

Webes frontend indítása
– A frontend mappába történő navigálás terminál segítségével: cd .\frontend\
– Az első futtatás előtt a szükséges függőségek telepítése: npm install
– A projekt indítása: npm start
– A rendszer a böngészőben, localhost címen válik elérhetővé
