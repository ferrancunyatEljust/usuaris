# Prova 1 (10/11/2025)

1. (3p) Analitza l'script inicial de creació de base de dades i implementa l’API d’usuaris següent:
   1. GET /api/users: retorna name i role dels usuaris.
   2. POST /api/users: rep JSON amb username, password i role (user per defecte).
   3. Comprova els endpoints i envia les captures demostrant que funcionen.
2. (3p) Afegir middleware d’autorització al GET d’usuaris:
   1. Crea un middleware requireAdmin que:
      * Llegeixa les credencials de la petició.
      * Comprove a la BD que username i password existeixen i que el role és admin.
      * Denegue l’accés si no es compleix (respostes 401 o 403 segons corresponga).
3. (2p) Si ens feren injecció d'SQL sobre la nostra base de dades podrien obtindre les credencials i accedir a l'endpoint desitjat.
   1. Mitiga l'injecció d'sql en cas que el teu codi siga vulnerable a este atac.
   2. Modifca els endpoints per a que:
      1. En insertar l'usuari en la base de dades, no inserte la contrasenya en text plà, sinó que inserte el hash d'aquesta, calculat mitjançant bcrypt.
      2. Modifica el middleware per a que funcione utilitzant el hash de les contrasenyes.
