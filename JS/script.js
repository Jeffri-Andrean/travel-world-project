function sapaPengunjung() {

    let namaTersimpan = sessionStorage.getItem("namaPengunjung");

    if (namaTersimpan) {
        document.querySelector("main h2").innerHTML = "Selamat Datang di Portal Eksplorasi, " + namaTersimpan + "!";
    } 
    else {
        let namaTamu = prompt("Halo! Siapa nama Anda?", "Petualang");
        
        if (namaTamu !== null && namaTamu.trim() !== "") {
            sessionStorage.setItem("namaPengunjung", namaTamu);

            document.querySelector("main h2").innerHTML = "Selamat Datang di Portal Eksplorasi, " + namaTamu + "!";
        }
    }
}

function pesanPaket(namaPaket, hargaPerOrang) {
    let inputJumlah = prompt("Berapa orang yang akan ikut dalam " + namaPaket + "?", "1");

    if (inputJumlah !== null) {

        let jumlah = Number(inputJumlah);

        if (jumlah > 0 && Number.isInteger(jumlah)) {
           
            const totalHarga = jumlah * hargaPerOrang;
     
            let totalFormat = totalHarga.toLocaleString('id-ID');
            alert("Berhasil! Anda memesan " + namaPaket + " untuk " + jumlah + " orang.\nTotal biaya: Rp " + totalFormat);
        } else {
            alert("Jumlah tidak valid! Harap masukkan angka bulat (misal: 1, 2, atau 3).");
        }
    }
}

function prosesForm(event, jenisForm) {
    event.preventDefault(); 
    
    if (jenisForm === 'kontak') {
        let nama = document.getElementById("nama").value;
        let email = document.getElementById("email").value;
        alert("Terima kasih, " + nama + "! Pesan Anda telah kami terima dan akan segera dibalas melalui email (" + email + ").");
        document.querySelector("form").reset(); 
    } 
    else if (jenisForm === 'login') {
        let username = document.getElementById("username").value;
        alert("Selamat datang kembali, " + username + "!");
    }
}