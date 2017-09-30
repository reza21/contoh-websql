//Cek compatibility browser dalam menangani websql
if (window.openDatabase) {
    //Membuat database, parameter: 1. nama database, 2.versi db, 3. deskripsi 4. ukuran database (dalam bytes) 1024 x 1024 = 1MB
    var mydb = openDatabase("biodata", "0.1", "biodata peserta workshop", 1024 * 1024);

    //membuat tabel person dengan SQL untuk database menggunakan function transaction
    mydb.transaction(function (t) {
        t.executeSql("CREATE TABLE IF NOT EXISTS person (id INTEGER PRIMARY KEY ASC, nama TEXT, alamat TEXT)");
    });

} else {
    alert("WebSQL tidak didukung oleh browser ini!");
}

//function to menginput data ke database
function tambah_data() {
    //cek apakah objek mydb sudah dibuat
    if (mydb) {
        //mendapatkan nilai dari form
        var input_nama = document.getElementById("nama").value;
        var input_alamat = document.getElementById("alamat").value;

        //cek apakah nilai sudah diinput di form
        if (nama !== "" && alamat !== "") {
            //Insert data yang diisi pada form, tanda ? hanya sebagai placeholder, akan digantikan dengan data array pada parameter kedua
            mydb.transaction(function (t) {
                t.executeSql("INSERT INTO person (nama, alamat) VALUES (?, ?)", [input_nama, input_alamat]);
            });
        } else {
            alert("nama dan alamat harus diisi!");
        }
    } else {
        alert("database tidak ditemukan, browser tidak support web sql!");
    }
}

//function untuk menampilkan data ke tabel di index.html
function update_list(transaction, results) {
    //inisialisasi variabel item untuk menampung data dari database
    var listitems = "";
    //mendapatkan nilai dari komponen list_data
    var listholder = document.getElementById("list_data");

    //clear list di tabel
    listholder.innerHTML = "";

    var i;
    //perulangan untuk menampilkan hasil
    for (i = 0; i < results.rows.length; i++) {
        //mendapatkan data pada row ke i
        var row = results.rows.item(i);

        listholder.innerHTML += "<tr><td>" + row.nama + "</td><td>" + row.alamat + " </td> <td> <a href='javascript:void(0);' onclick='hapus_data(" + row.id + ");'>Hapus</a> </td> </tr>";
    }

}

//function untuk mendapatkan data dari database
function show_data() {
    //cek apakah objek mydb sudah dibuat
    if (mydb) {
        //mendapatkan semua data dari database, set update_list sebagai callback function di dalam executeSql 
        mydb.transaction(function (t) {
            t.executeSql("SELECT * FROM person", [], update_list);
        });
    } else {
        alert("database tidak ditemukan, browser tidak support web sql!");
    }
}

//function untuk menghapus data dari database, di dalam parameter terdapat id row dari data yang akan dihapus
function hapus_data(id) {
    //cek apakah objek mydb sudah dibuat
    if (mydb) {
        //menghapus data dari database berdasarkan parameter, set show_data sebagai callback function di dalam executeSql 
        mydb.transaction(function (t) {
            t.executeSql("DELETE FROM person WHERE id=?", [id], show_data);
        });
    } else {
        alert("database tidak ditemukan, browser tidak support web sql!");
    }
}


// pemanggilan function untuk menampilkan data dari database
show_data();