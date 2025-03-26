
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Org.BouncyCastle.Asn1;
using PhonesAPI3.Models;
using System.Collections.Generic;
using System.Data;


public class allPhones
{
    public int PhoneID { get; set; }
    public string PhoneNev { get; set; }
    public string CPUNev { get; set; }
    public int CPUAntutu { get; set; }
    public double CPUMaxOrajel { get; set; }
    public int CPUMagokSzama { get; set; }
    public int CPUGyartasiTechnologia { get; set; }
    public string KijelzoTipusa { get; set; }
    public int KijelzoFelbontasMagassag { get; set; }
    public int KijelzoFelbontasSzelesseg { get; set; }
    public double KijelzoMerete { get; set; }
    public int KijelzoFrissitesiRata { get; set; }
    public int KijelzoMaxFenyero { get; set; }
    public int KijelzoElesseg { get; set; }
    public int CsatlakoztathatosagWifi { get; set; }
    public double CsatlakoztathatosagBluetooth { get; set; }
    public int CsatlakoztathatosagMobilhalozat { get; set; }
    public string CsatlakoztathatosagDualSim { get; set; }
    public string CsatlakoztathatosagESim { get; set; }
    public string CsatlakoztathatosagNfc { get; set; }
    public double CsatlakoztathatosagCsatlakozoGyorsasaga { get; set; }
    public string CsatlakoztathatosagJackCsatlakozo { get; set; }
    public string SzenzorokUjjlenyomatHely { get; set; }
    public string SzenzorokUjjlenyomatTipus { get; set; }
    public string SzenzorokInfravoros { get; set; }
    public int RamMennyiseg { get; set; }
    public int StorageMennyiseg { get; set; }
    public string RamSebesseg { get; set; }
    public string StorageSebesseg { get; set; }
    public int AkkumulatorKapacitas { get; set; }
    public string AkkumulatorTipusa { get; set; }
    public string ToltoTipus { get; set; }
    public int ToltoVezetekes { get; set; }
    public int ToltoVezeteknelkuli { get; set; }
    public string KameraNev { get; set; }
    public int KameraFelbontas { get; set; }
    public string KameraRekeszertek { get; set; }
    public int KameraFokusztavolsag { get; set; }
    public string KameraOptikaiKepStabilizator { get; set; }
    public double TestMagassag { get; set; }
    public double TestSzelesseg { get; set; }
    public double TestVastagsag { get; set; }
    public string TestVizalossag { get; set; }
    public string TestHatlapAnyaga { get; set; }
}


public class FeltoltesTeszt
{
    public string tablaNev { get; set; }
    public string oszlopNev { get; set; }
    public string foOsztalyNev { get; set; }
    public string kapcsTablaOszlop { get; set; }
    public bool isMatching { get; set; }
    public int ID { get; set; }

}


[Route("api/[controller]")]
[ApiController]
public class allPhonesController : ControllerBase
{
    private readonly string connectionString = "Server=localhost;Database=phonescout1;User=root;Password=;Allow User Variables=true;";

    [HttpGet]
    public ActionResult<IEnumerable<allPhones>> GetPhones()
    {
        


        var phones = new List<allPhones>();
        using (var connection = new MySqlConnection(connectionString))
        {
            connection.Open();
            var query = $@"
            SELECT connectionphone.phoneID, connectionphone.phoneNev, cpu.cpuNev, connectionphone.phoneAntutu, cpu.cpuMaxOrajel, cpu.cpuMagokSzama, cpu.cpuGyartasiTechnologia, kijelzotipusa.kijelzoNev, connectionphone.kijelzoFelbontasMagassag, connectionphone.KijelzoFelbontasSzelesseg, connectionphone.kijelzoMeret, connectionphone.kijelzoFrissitesiRata, connectionphone.kijelzoMaxFenyero, connectionphone.kijelzoElesseg, csatlakoztathatosagwifi.csatlakoztathatosagWifi, csatlakoztathatosagbluetooth.csatlakoztathatosagBluetooth, csatlakoztathatosagmobilhalozat.csatlakoztathatosagMobilhalozat, connectionphone.csatlakoztathatosagDualSim, connectionphone.csatlakoztathatosagESim, connectionphone.csatlakoztathatosagNfc, toltotipusa.ToltoTipusa, csatlakoztathatosagcsatlakozogyorsasaga.csatlakoztathatosagCsatlakozoGyorsasaga, connectionphone.csatlakoztathatosagJack, szenzorokujjlenyomathelye.szenzorokUjjlenyomatHelye, szenzorokujjlenyomattipusa.szenzorokUjjlenyomatTipusa, connectionphone.szenzorokInfravoros, ramstorage.ramstorageRamMennyiseg, ramstorage.ramstorageStorageMennyiseg, ramsebesseg.ramSebesseg, storagesebesseg.storageSebesseg, connectionphone.akkumulatorKapacitas, akkumulatortipusa.akkumulatorTipusa, connectionphone.akkumulatorVezetekesMax, connectionphone.akkumulatorVezeteknelkuliMax, kamera.kameraNev, kamera.kameraFelbontas, kamera.kameraRekeszertek, kamera.kameraFokusztavolsag, kamera.kameraOptikaiKepstabilizator, connectionphone.testMagassag, connectionphone.testSzelesseg, connectionphone.testVastagsag, vizallosag.vizallosagTipusa, hatlapanyaga.hatlapAnyaga FROM connectionphone

                JOIN cpu ON connectionphone.cpuID = cpu.ID
                JOIN akkumulatortipusa ON connectionphone.akkumulatorTipusaID = akkumulatortipusa.ID
                JOIN csatlakoztathatosagwifi ON connectionphone.csatlakoztathatosagWifiID = csatlakoztathatosagwifi.ID
                JOIN csatlakoztathatosagbluetooth ON connectionphone.csatlakoztathatosagBluetoothID = csatlakoztathatosagbluetooth.ID
                JOIN csatlakoztathatosagmobilhalozat ON connectionphone.csatlakoztathatosagMobilhalozatID = csatlakoztathatosagmobilhalozat.ID
                JOIN csatlakoztathatosagcsatlakozogyorsasaga ON connectionphone.csatlakoztathatosagCsatlakozoGyorsasagaID = csatlakoztathatosagcsatlakozogyorsasaga.ID
                JOIN hatlapanyaga ON connectionphone.hatlapAnyagaID = hatlapanyaga.ID
                JOIN kamera ON connectionphone.kameraID = kamera.ID
                JOIN kijelzotipusa ON connectionphone.kijelzoTipusID = kijelzotipusa.ID
                JOIN ramsebesseg ON connectionphone.ramSebessegID = ramsebesseg.ID
                JOIN ramstorage ON connectionphone.ramstorageID = ramstorage.ID
                JOIN storagesebesseg ON connectionphone.storageSebessegID = storagesebesseg.ID
                JOIN szenzorokujjlenyomathelye ON connectionphone.szenzorokUjjlenyomatHelyID = szenzorokujjlenyomathelye.ID
                JOIN szenzorokujjlenyomattipusa ON connectionphone.szenzorokUjjlenyomatTipusID = szenzorokujjlenyomattipusa.ID
                JOIN toltotipusa ON connectionphone.toltoTipusaID = toltotipusa.ID
                JOIN vizallosag ON connectionphone.vizallosagID = vizallosag.ID";

            using (var command = new MySqlCommand(query, connection))
            using (var reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    phones.Add(new allPhones
                    {
                        PhoneID = reader.IsDBNull("phoneID") ? 0 : reader.GetInt32("phoneID"),
                        PhoneNev = reader.IsDBNull("phoneNev") ? null : reader.GetString("phoneNev"),
                        CPUNev = reader.IsDBNull("cpuNev") ? null : reader.GetString("cpuNev"),
                        CPUAntutu = reader.IsDBNull("phoneAntutu") ? 0 : reader.GetInt32("phoneAntutu"),
                        CPUMaxOrajel = reader.IsDBNull("cpuMaxOrajel") ? 0 : Convert.ToDouble(reader["cpuMaxOrajel"]),
                        CPUMagokSzama = reader.IsDBNull("cpuMagokSzama") ? 0 : reader.GetInt32("cpuMagokSzama"),
                        CPUGyartasiTechnologia = reader.IsDBNull("cpuGyartasiTechnologia") ? 0 : reader.GetInt32("cpuGyartasiTechnologia"),

                        KijelzoTipusa = reader.IsDBNull("kijelzoNev") ? null : reader.GetString("kijelzoNev"),
                        KijelzoFelbontasMagassag = reader.IsDBNull("kijelzoFelbontasMagassag") ? 0 : reader.GetInt32("kijelzoFelbontasMagassag"),
                        KijelzoFelbontasSzelesseg = reader.IsDBNull("KijelzoFelbontasSzelesseg") ? 0 : reader.GetInt32("KijelzoFelbontasSzelesseg"),
                        KijelzoMerete = reader.IsDBNull("kijelzoMeret") ? 0 : reader.GetDouble("kijelzoMeret"),
                        KijelzoFrissitesiRata = reader.IsDBNull("kijelzoFrissitesiRata") ? 0 : reader.GetInt32("kijelzoFrissitesiRata"),
                        KijelzoMaxFenyero = reader.IsDBNull("kijelzoMaxFenyero") ? 0 : reader.GetInt32("kijelzoMaxFenyero"),
                        KijelzoElesseg = reader.IsDBNull("kijelzoElesseg") ? 0 : reader.GetInt32("kijelzoElesseg"),

                        CsatlakoztathatosagWifi = reader.IsDBNull("csatlakoztathatosagWifi") ? 0 : reader.GetInt32("csatlakoztathatosagWifi"),
                        CsatlakoztathatosagBluetooth = reader.IsDBNull("csatlakoztathatosagBluetooth") ? 0 : Convert.ToDouble(reader["csatlakoztathatosagBluetooth"]),
                        CsatlakoztathatosagMobilhalozat = reader.IsDBNull("csatlakoztathatosagMobilhalozat") ? 0 : reader.GetInt32("csatlakoztathatosagMobilhalozat"),
                        CsatlakoztathatosagDualSim = reader.IsDBNull("csatlakoztathatosagDualSim") ? null : reader.GetString("csatlakoztathatosagDualSim"),
                        CsatlakoztathatosagESim = reader.IsDBNull("csatlakoztathatosagESim") ? null : reader.GetString("csatlakoztathatosagESim"),
                        CsatlakoztathatosagNfc = reader.IsDBNull("csatlakoztathatosagNfc") ? null : reader.GetString("csatlakoztathatosagNfc"),
                        CsatlakoztathatosagCsatlakozoGyorsasaga = reader.IsDBNull("csatlakoztathatosagCsatlakozoGyorsasaga") ? 0 : Convert.ToDouble(reader["csatlakoztathatosagCsatlakozoGyorsasaga"]),
                        CsatlakoztathatosagJackCsatlakozo = reader.IsDBNull("csatlakoztathatosagJack") ? null : reader.GetString("csatlakoztathatosagJack"),

                        SzenzorokUjjlenyomatHely = reader.IsDBNull("szenzorokUjjlenyomatHelye") ? null : reader.GetString("szenzorokUjjlenyomatHelye"),
                        SzenzorokUjjlenyomatTipus = reader.IsDBNull("szenzorokUjjlenyomatTipusa") ? null : reader.GetString("szenzorokUjjlenyomatTipusa"),
                        SzenzorokInfravoros = reader.IsDBNull("szenzorokInfravoros") ? null : reader.GetString("szenzorokInfravoros"),

                        ToltoTipus = reader.IsDBNull("ToltoTipusa") ? null : reader.GetString("ToltoTipusa"),
                        ToltoVezetekes = reader.IsDBNull("akkumulatorVezetekesMax") ? 0 : reader.GetInt32("akkumulatorVezetekesMax"),
                        ToltoVezeteknelkuli = reader.IsDBNull("akkumulatorVezeteknelkuliMax") ? 0 : reader.GetInt32("akkumulatorVezeteknelkuliMax"),

                        RamMennyiseg = reader.IsDBNull("ramstorageRamMennyiseg") ? 0 : reader.GetInt32("ramstorageRamMennyiseg"),
                        StorageMennyiseg = reader.IsDBNull("ramstorageStorageMennyiseg") ? 0 : reader.GetInt32("ramstorageStorageMennyiseg"),
                        RamSebesseg = reader.IsDBNull("ramSebesseg") ? null : reader.GetString("ramSebesseg"),
                        StorageSebesseg = reader.IsDBNull("storageSebesseg") ? null : reader.GetString("storageSebesseg"),

                        AkkumulatorKapacitas = reader.IsDBNull("akkumulatorKapacitas") ? 0 : reader.GetInt32("akkumulatorKapacitas"),
                        AkkumulatorTipusa = reader.IsDBNull("akkumulatorTipusa") ? null : reader.GetString("akkumulatorTipusa"),

                        KameraNev = reader.IsDBNull("kameraNev") ? null : reader.GetString("kameraNev"),
                        KameraFelbontas = reader.IsDBNull("kameraFelbontas") ? 0 : reader.GetInt32("kameraFelbontas"),
                        KameraRekeszertek = reader.IsDBNull("kameraRekeszertek") ? null : reader.GetString("kameraRekeszertek"),
                        KameraFokusztavolsag = reader.IsDBNull("kameraFokusztavolsag") ? 0 : reader.GetInt32("kameraFokusztavolsag"),
                        KameraOptikaiKepStabilizator = reader.IsDBNull("kameraOptikaiKepstabilizator") ? null : reader.GetString("kameraOptikaiKepstabilizator"),

                        TestMagassag = reader.IsDBNull("testMagassag") ? 0 : Convert.ToDouble(reader["testMagassag"]),
                        TestSzelesseg = reader.IsDBNull("testSzelesseg") ? 0 : Convert.ToDouble(reader["testSzelesseg"]),
                        TestVastagsag = reader.IsDBNull("testVastagsag") ? 0 : Convert.ToDouble(reader["testVastagsag"]),

                        TestVizalossag = reader.IsDBNull("vizallosagTipusa") ? null : reader.GetString("vizallosagTipusa"),
                        TestHatlapAnyaga = reader.IsDBNull("hatlapAnyaga") ? null : reader.GetString("hatlapAnyaga")
                    });
                }
            }
        }

        return Ok(phones);
    }




    [HttpPost("phonePost")]
    public IActionResult PhonePost([FromBody] allPhones phone)
    {
        List<FeltoltesTeszt> egyTabla = new List<FeltoltesTeszt>();
        egyTabla.Add(new FeltoltesTeszt { tablaNev = "cpu", oszlopNev = "cpuNev", foOsztalyNev = phone.CPUNev, kapcsTablaOszlop = "cpuID", isMatching = false, ID = 0 });

        egyTabla.Add(new FeltoltesTeszt { tablaNev = "kijelzotipusa", oszlopNev = "kijelzoNev", foOsztalyNev = phone.KijelzoTipusa, kapcsTablaOszlop = "kijelzoTipusID", isMatching = false, ID = 0 });

        egyTabla.Add(new FeltoltesTeszt { tablaNev = "csatlakoztathatosagwifi", oszlopNev = "csatlakoztathatosagWifi", foOsztalyNev = phone.CsatlakoztathatosagWifi.ToString(), kapcsTablaOszlop = "csatlakoztathatosagWifiID", isMatching = false, ID = 0 });

        egyTabla.Add(new FeltoltesTeszt { tablaNev = "csatlakoztathatosagbluetooth", oszlopNev = "csatlakoztathatosagBluetooth", foOsztalyNev = phone.CsatlakoztathatosagBluetooth.ToString(), kapcsTablaOszlop = "csatlakoztathatosagBluetoothID", isMatching = false, ID = 0 });

        egyTabla.Add(new FeltoltesTeszt { tablaNev = "csatlakoztathatosagmobilhalozat", oszlopNev = "csatlakoztathatosagMobilhalozat", foOsztalyNev = phone.CsatlakoztathatosagMobilhalozat.ToString(), kapcsTablaOszlop = "csatlakoztathatosagMobilhalozatID", isMatching = false, ID = 0 });

        egyTabla.Add(new FeltoltesTeszt { tablaNev = "csatlakoztathatosagcsatlakozogyorsasaga", oszlopNev = "csatlakoztathatosagCsatlakozoGyorsasaga", foOsztalyNev = phone.CsatlakoztathatosagCsatlakozoGyorsasaga.ToString(), kapcsTablaOszlop = "csatlakoztathatosagCsatlakozoGyorsasagaID", isMatching = false, ID = 0 });

        egyTabla.Add(new FeltoltesTeszt { tablaNev = "szenzorokujjlenyomathelye", oszlopNev = "szenzorokUjjlenyomatHelye", foOsztalyNev = phone.SzenzorokUjjlenyomatHely, kapcsTablaOszlop = "szenzorokUjjlenyomatHelyeID", isMatching = false, ID = 0 });

        egyTabla.Add(new FeltoltesTeszt { tablaNev = "szenzorokujjlenyomattipusa", oszlopNev = "szenzorokUjjlenyomatTipusa", foOsztalyNev = phone.SzenzorokUjjlenyomatTipus, kapcsTablaOszlop = "szenzorokUjjlenyomatTipusaID", isMatching = false, ID = 0 });

        egyTabla.Add(new FeltoltesTeszt { tablaNev = "ramstorage", oszlopNev = "ramstorageRamMennyiseg", foOsztalyNev = phone.RamMennyiseg.ToString(), kapcsTablaOszlop = "ramstorageID", isMatching = false, ID = 0 });

        egyTabla.Add(new FeltoltesTeszt { tablaNev = "ramsebesseg", oszlopNev = "ramSebesseg", foOsztalyNev = phone.RamSebesseg, kapcsTablaOszlop = "ramSebessegID", isMatching = false, ID = 0 });

        egyTabla.Add(new FeltoltesTeszt { tablaNev = "storagesebesseg", oszlopNev = "storageSebesseg", foOsztalyNev = phone.StorageSebesseg, kapcsTablaOszlop = "storageSebessegID", isMatching = false, ID = 0 });

        egyTabla.Add(new FeltoltesTeszt { tablaNev = "toltotipusa", oszlopNev = "ToltoTipusa", foOsztalyNev = phone.ToltoTipus, kapcsTablaOszlop = "toltoTipusaID", isMatching = false, ID = 0 });

        egyTabla.Add(new FeltoltesTeszt { tablaNev = "akkumulatortipusa", oszlopNev = "akkumulatorTipusa", foOsztalyNev = phone.AkkumulatorTipusa, kapcsTablaOszlop = "akkumulatorTipusaID", isMatching = false, ID = 0 });

        egyTabla.Add(new FeltoltesTeszt { tablaNev = "kamera", oszlopNev = "kameraNev", foOsztalyNev = phone.KameraNev, kapcsTablaOszlop = "kameraID", isMatching = false, ID = 0 });

        egyTabla.Add(new FeltoltesTeszt { tablaNev = "vizallosag", oszlopNev = "vizallosagTipusa", foOsztalyNev = phone.TestVizalossag, kapcsTablaOszlop = "vizallosagID", isMatching = false, ID = 0 });

        egyTabla.Add(new FeltoltesTeszt { tablaNev = "hatlapanyaga", oszlopNev = "hatlapAnyaga", foOsztalyNev = phone.TestHatlapAnyaga, kapcsTablaOszlop = "hatlapAnyagaID", isMatching = false, ID = 0 });

        using (MySqlConnection conn = new MySqlConnection(connectionString))
        {

            //van e már ilyen elem a táblába
            conn.Open();
            string selectQuery = "";
            for (int i = 0; i < egyTabla.Count; i++)
            {
                Console.WriteLine(egyTabla[i].foOsztalyNev.ToString());
                if (egyTabla[i].foOsztalyNev != "" || egyTabla[i].foOsztalyNev.ToString() != "0")
                {
                    selectQuery = $"SELECT ID, {egyTabla[i].oszlopNev} FROM {egyTabla[i].tablaNev}";
                    using (MySqlCommand select = new MySqlCommand(selectQuery, conn))
                    {
                        using (MySqlDataReader reader = select.ExecuteReader())
                        {
                            
                            while (reader.Read())
                            {
                                if (reader.GetFieldType(1) == typeof(string))
                                {                                    
                                    if (reader.GetString(1) == egyTabla[i].foOsztalyNev)
                                    {
                                        egyTabla[i].isMatching = true;
                                        egyTabla[i].ID = reader.GetInt32(0);
                                    }       

                                }
                                else if (reader.GetFieldType(1) == typeof(int))
                                {
                                    if (reader.GetInt32(1) == int.Parse(egyTabla[i].foOsztalyNev))
                                    {
                                        egyTabla[i].isMatching = true;
                                        egyTabla[i].ID = reader.GetInt32(0);
                                    }
                                    
                                }
                                else if (reader.GetFieldType(1) == typeof(double))
                                {
                                    if (reader.GetDouble(1).ToString() == egyTabla[i].foOsztalyNev)
                                    {
                                        egyTabla[i].isMatching = true;
                                        egyTabla[i].ID = reader.GetInt32(0);

                                    }
                                }
                            }                            
                        }
                    }
                }
                else
                {
                    Console.WriteLine("pablo");
                }
            }

            //ha nincs felveszi
            for (int i = 0; i < egyTabla.Count; i++)
            {


                if (!egyTabla[i].isMatching)
                {
                    if (egyTabla[i].tablaNev == "cpu")
                    {
                        string connInsertQuery = $"INSERT INTO cpu (cpuNev,cpuMaxOrajel,cpuMagokSzama,cpuGyartasiTechnologia) VALUES(@cpuNev,@cpuMaxOrajel,@cpuMagokSzama,@cpuGyartasiTechnologia)";

                        using (MySqlCommand cmd = new MySqlCommand(connInsertQuery, conn))
                        {
                            cmd.Parameters.AddWithValue($"@cpuNev", phone.CPUNev);
                            cmd.Parameters.AddWithValue($"@cpuMaxOrajel", phone.CPUMaxOrajel);
                            cmd.Parameters.AddWithValue($"@cpuMagokSzama", phone.CPUMagokSzama);
                            cmd.Parameters.AddWithValue($"@cpuGyartasiTechnologia", phone.CPUGyartasiTechnologia);

                            try
                            {
                                cmd.ExecuteNonQuery();

                                // Retrieve the last inserted ID
                                string selectLastIDQuery = "SELECT LAST_INSERT_ID()";
                                using (MySqlCommand lastIDCmd = new MySqlCommand(selectLastIDQuery, conn))
                                {
                                    egyTabla[i].ID = Convert.ToInt32(lastIDCmd.ExecuteScalar());
               
                                }
                            }
                            catch (MySqlException ex)
                            {
                                Console.WriteLine("Error during insert: " + ex.Message);
                            }
                        }
                    }
                    else if (egyTabla[i].tablaNev == "kamera")
                    {
                        string connInsertQuery = $"INSERT INTO kamera (kameraNev, kameraFelbontas, kameraRekeszertek, kameraFokusztavolsag,  kameraOptikaiKepstabilizator) VALUES (@kameraNev, @kameraFelbontas, @kameraRekeszertek,@kameraFokusztavolsag, @kameraOptikaiKepstabilizator)";

                        using (MySqlCommand cmd = new MySqlCommand(connInsertQuery, conn))
                        {
                            cmd.Parameters.AddWithValue($"@kameraNev", phone.KameraNev);
                            cmd.Parameters.AddWithValue($"@kameraFelbontas", phone.KameraFelbontas);
                            cmd.Parameters.AddWithValue($"@kameraRekeszertek", phone.KameraRekeszertek);
                            cmd.Parameters.AddWithValue($"@kameraFokusztavolsag", phone.KameraFokusztavolsag);
                            cmd.Parameters.AddWithValue($"@kameraOptikaiKepstabilizator", phone.KameraOptikaiKepStabilizator);

                            try
                            {
                                cmd.ExecuteNonQuery();
                                // Retrieve the last inserted ID
                                string selectLastIDQuery = "SELECT LAST_INSERT_ID()";
                                using (MySqlCommand lastIDCmd = new MySqlCommand(selectLastIDQuery, conn))
                                {
                                    egyTabla[i].ID = Convert.ToInt32(lastIDCmd.ExecuteScalar());
                                }
                            }
                            catch (MySqlException ex)
                            {
                                Console.WriteLine("Error during insert: " + ex.Message);
                            }
                        }
                    }
                    else
                    {
                        string connInsertQuery = $"INSERT INTO {egyTabla[i].tablaNev} ({egyTabla[i].oszlopNev}) VALUES (@{egyTabla[i].oszlopNev})";
                        
                        using (MySqlCommand cmd = new MySqlCommand(connInsertQuery, conn))
                        {
                            cmd.Parameters.AddWithValue($"@{egyTabla[i].oszlopNev}", egyTabla[i].foOsztalyNev);
                            try
                            {
                                cmd.ExecuteNonQuery();

                                // Retrieve the last inserted ID
                                string selectLastIDQuery = "SELECT LAST_INSERT_ID()";
                                using (MySqlCommand lastIDCmd = new MySqlCommand(selectLastIDQuery, conn))
                                {
                                    egyTabla[i].ID = Convert.ToInt32(lastIDCmd.ExecuteScalar());
                             
                                }
                            }
                            catch (MySqlException ex)
                            {
                                Console.WriteLine("Error during insert: " + ex.Message);
                            }
                        }
                    }
                }
            }

            // 3. kapcsoló tábla hozzáadás


            // Now the correct IDs should be used
            string insertQuery = $@"
INSERT INTO connectionphone (
    phoneNev, cpuID, phoneAntutu, kijelzoTipusID, kijelzoFelbontasMagassag, kijelzoFelbontasSzelesseg, kijelzoMeret, kijelzoFrissitesiRata, kijelzoMaxFenyero, kijelzoElesseg, 
    csatlakoztathatosagWifiID, csatlakoztathatosagBluetoothID, csatlakoztathatosagMobilhalozatID, csatlakoztathatosagDualSim, csatlakoztathatosagESim, csatlakoztathatosagNfc, 
    toltoTipusaID, csatlakoztathatosagCsatlakozoGyorsasagaID, csatlakoztathatosagJack, szenzorokUjjlenyomatHelyID, szenzorokUjjlenyomatTipusID, szenzorokInfravoros, 
    ramstorageID, ramSebessegID, storageSebessegID, akkumulatorTipusaID, akkumulatorKapacitas, akkumulatorVezetekesMax, akkumulatorVezeteknelkuliMax, kameraID, 
    testMagassag, testSzelesseg, testVastagsag, vizallosagID, hatlapAnyagaID
) 
VALUES (
    @phoneNev, @cpuID, @phoneAntutu, @kijelzoTipusID, @kijelzoFelbontasMagassag, @kijelzoFelbontasSzelesseg, @kijelzoMeret, @kijelzoFrissitesiRata, @kijelzoMaxFenyero, 
    @kijelzoElesseg, @csatlakoztathatosagWifiID, @csatlakoztathatosagBluetoothID, @csatlakoztathatosagMobilhalozatID, @csatlakoztathatosagDualSim, @csatlakoztathatosagESim, 
    @csatlakoztathatosagNfc, @toltoTipusaID, @csatlakoztathatosagCsatlakozoGyorsasagaID, @csatlakoztathatosagJack, @szenzorokUjjlenyomatHelyID, @szenzorokUjjlenyomatTipusID, 
    @szenzorokInfravoros, @ramstorageID, @ramSebessegID, @storageSebessegID, @akkumulatorTipusaID, @akkumulatorKapacitas, @akkumulatorVezetekesMax, @akkumulatorVezeteknelkuliMax, 
    @kameraID, @testMagassag, @testSzelesseg, @testVastagsag, @vizallosagID, @hatlapAnyagaID
)";

            // Adding parameters with the correct names
            using (MySqlCommand cmd = new MySqlCommand(insertQuery, conn))
            {
                cmd.Parameters.AddWithValue("@phoneNev", phone.PhoneNev);
                cmd.Parameters.AddWithValue("@cpuID", egyTabla[0].ID);
                cmd.Parameters.AddWithValue("@phoneAntutu", phone.CPUAntutu);
                cmd.Parameters.AddWithValue("@kijelzoTipusID", egyTabla[1].ID);
                cmd.Parameters.AddWithValue("@kijelzoFelbontasMagassag", phone.KijelzoFelbontasMagassag);
                cmd.Parameters.AddWithValue("@kijelzoFelbontasSzelesseg", phone.KijelzoFelbontasSzelesseg);
                cmd.Parameters.AddWithValue("@kijelzoMeret", phone.KijelzoMerete);
                cmd.Parameters.AddWithValue("@kijelzoFrissitesiRata", phone.KijelzoFrissitesiRata);
                cmd.Parameters.AddWithValue("@kijelzoMaxFenyero", phone.KijelzoMaxFenyero);
                cmd.Parameters.AddWithValue("@kijelzoElesseg", phone.KijelzoElesseg);
                cmd.Parameters.AddWithValue("@csatlakoztathatosagWifiID", egyTabla[2].ID);
                cmd.Parameters.AddWithValue("@csatlakoztathatosagBluetoothID", egyTabla[3].ID);
                cmd.Parameters.AddWithValue("@csatlakoztathatosagMobilhalozatID", egyTabla[4].ID);
                cmd.Parameters.AddWithValue("@csatlakoztathatosagDualSim", phone.CsatlakoztathatosagDualSim);
                cmd.Parameters.AddWithValue("@csatlakoztathatosagESim", phone.CsatlakoztathatosagESim);
                cmd.Parameters.AddWithValue("@csatlakoztathatosagNfc", phone.CsatlakoztathatosagNfc);
                cmd.Parameters.AddWithValue("@toltoTipusaID", egyTabla[11].ID);
                cmd.Parameters.AddWithValue("@csatlakoztathatosagCsatlakozoGyorsasagaID", egyTabla[5].ID);
                cmd.Parameters.AddWithValue("@csatlakoztathatosagJack", phone.CsatlakoztathatosagJackCsatlakozo);
                cmd.Parameters.AddWithValue("@szenzorokUjjlenyomatHelyID", egyTabla[6].ID);
                cmd.Parameters.AddWithValue("@szenzorokUjjlenyomatTipusID", egyTabla[7].ID);
                cmd.Parameters.AddWithValue("@szenzorokInfravoros", phone.SzenzorokInfravoros);
                cmd.Parameters.AddWithValue("@ramstorageID", egyTabla[8].ID);
                cmd.Parameters.AddWithValue("@ramSebessegID", egyTabla[9].ID);
                cmd.Parameters.AddWithValue("@storageSebessegID", egyTabla[10].ID);
                cmd.Parameters.AddWithValue("@akkumulatorTipusaID", egyTabla[12].ID);
                cmd.Parameters.AddWithValue("@akkumulatorKapacitas", phone.AkkumulatorKapacitas);
                cmd.Parameters.AddWithValue("@akkumulatorVezetekesMax", phone.ToltoVezetekes);
                cmd.Parameters.AddWithValue("@akkumulatorVezeteknelkuliMax", phone.ToltoVezeteknelkuli);
                cmd.Parameters.AddWithValue("@kameraID", egyTabla[13].ID);
                cmd.Parameters.AddWithValue("@testMagassag", phone.TestMagassag);
                cmd.Parameters.AddWithValue("@testSzelesseg", phone.TestSzelesseg);
                cmd.Parameters.AddWithValue("@testVastagsag", phone.TestVastagsag);
                cmd.Parameters.AddWithValue("@vizallosagID", egyTabla[14].ID);
                cmd.Parameters.AddWithValue("@hatlapAnyagaID", egyTabla[15].ID);

                try
                {
                    cmd.ExecuteNonQuery();
                    return Ok("Telefon sikeresen felvéve");
                }
                catch (MySqlException ex)
                {
                    return BadRequest("Error: " + ex.Message);
                }
            }


        }

    }
}
