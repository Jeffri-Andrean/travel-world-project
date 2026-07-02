$(document).ready(function() {

    // --- 1. LOGIKA SAPAAN (Muncul pertama kali di halaman manapun) ---
    let namaTersimpan = sessionStorage.getItem("namaPengunjung");
    
    // Jika belum ada nama di memori browser, munculkan prompt
    if (!namaTersimpan) { 
        let namaTamu = prompt("Halo! Siapa nama Anda?", "Petualang");
        if (namaTamu !== null && $.trim(namaTamu) !== "") {
            sessionStorage.setItem("namaPengunjung", namaTamu);
            namaTersimpan = namaTamu; // Simpan ke variabel agar bisa dipakai di bawah
        }
    }

    // Hanya ubah tulisan H2 jika sedang di halaman Beranda
    if ($("body").hasClass("page-beranda") && namaTersimpan) {
        $("main h2").html("Selamat Datang di Portal Eksplorasi, " + namaTersimpan + "!");
    }


    // --- 2. FUNGSI ERROR ---
    function showError(input, errorElement, message) {
        input.addClass("error");
        errorElement.text(message);
    }

    function clearError(input, errorElement) {
        input.removeClass("error");
        errorElement.text("");
    }


    // --- 3. VALIDASI KONTAK ---
    $("#formKontak").submit(function(event) {
        event.preventDefault();
        let isValid = true;

        let nama = $("#nama");
        let email = $("#email");
        let pesan = $("#pesan");

        let namaError = $("#namaError");
        let emailError = $("#emailError");
        let pesanError = $("#pesanError");

        clearError(nama, namaError);
        clearError(email, emailError);
        clearError(pesan, pesanError);

        if ($.trim(nama.val()) === "") {
            showError(nama, namaError, "Nama tidak boleh kosong");
            isValid = false;
        } else if ($.trim(nama.val()).length < 4) {
            showError(nama, namaError, "Minimal panjang nama 4 karakter");
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if ($.trim(email.val()) === "") {
            showError(email, emailError, "Email tidak boleh kosong");
            isValid = false;
        } else if (!emailRegex.test($.trim(email.val()))) {
            showError(email, emailError, "Harus sesuai dengan format email yang ada (nama@domain)");
            isValid = false;
        }

        if ($.trim(pesan.val()) === "") {
            showError(pesan, pesanError, "Pesan tidak boleh kosong");
            isValid = false;
        }

        if (isValid) {
            $("#hasilForm").html("<p style='color: #27ae60; font-weight: bold;'>Terima kasih, " + nama.val() + "! Pesan Anda telah kami terima.</p>");
            $("#formKontak")[0].reset();
        }
    });


    // --- 4. VALIDASI LOGIN ---
    $("#formLogin").submit(function(event) {
        event.preventDefault();
        let isValid = true;

        let username = $("#username");
        let pass = $("#password");
        
        let userError = $("#userError");
        let passError = $("#passwordError");

        clearError(username, userError);
        clearError(pass, passError);

        if($.trim(username.val()) === "") {
            showError(username, userError, "Username tidak boleh kosong");
            isValid = false;
        }

        if($.trim(pass.val()) === "") {
            showError(pass, passError, "Password tidak boleh kosong");
            isValid = false;
        } else if($.trim(pass.val()).length < 6) {
            showError(pass, passError, "Panjang minimal 6 karakter");
            isValid = false;
        } else if($.trim(pass.val()).length > 16) {
            showError(pass, passError, "Panjang maksimum 16 karakter");
            isValid = false;
        }

        if(isValid) {
            $("#hasilForm").html("<p style='color: #27ae60; font-weight: bold;'>Selamat datang kembali, " + username.val() + "!</p>");
            $("#formLogin")[0].reset();
        }
    });


    // --- 5. AJAX DATA JSON ---
    $("#btn-muat-paket").click(function() {
        $.ajax({
            url: "paket.json",
            method: "GET",
            dataType: "json",
            success: function(response) {
                let kontenHTML = "";
                
                $.each(response, function(index, paket) {
                    let hargaFormat = paket.harga.toLocaleString('id-ID');
                    
                    let fasilitasHtml = "";
                    if (paket.fasilitas && paket.fasilitas.length > 0) {
                        fasilitasHtml += `<h4 style="color: #d4af37; text-align: left; margin-bottom: 15px;">Fasilitas Paket:</h4><ul>`;
                        $.each(paket.fasilitas, function(i, itemFasilitas) {
                            fasilitasHtml += `<li>${itemFasilitas}</li>`;
                        });
                        fasilitasHtml += `</ul>`;
                    }

                    let itineraryHtml = "";
                    if (paket.itinerary && paket.itinerary.length > 0) {
                        itineraryHtml += `<h4 style="color: #d4af37; text-align: left; margin-bottom: 15px;">Itinerary Singkat:</h4><ol>`;
                        $.each(paket.itinerary, function(i, itemItinerary) {
                            itineraryHtml += `<li>${itemItinerary}</li>`;
                        });
                        itineraryHtml += `</ol>`;
                    }
                    
                    kontenHTML += `
                        <article class="paket-card">
                            <h3 class="judul-paket" style="color: #d4af37; cursor: pointer;" data-harga="${paket.harga}">${paket.nama}</h3>
                            <div class="price">Rp ${hargaFormat} <span>/ ORANG</span></div>
                            <p>${paket.deskripsi}</p>
                            <hr>
                            ${fasilitasHtml}
                            ${itineraryHtml}
                            <button class="btn-pesan" data-nama="${paket.nama}" data-harga="${paket.harga}">Pesan Sekarang</button>
                        </article>
                    `;
                });

                $("#paketContainer").html(kontenHTML);
                $("#btn-muat-paket").hide(); 
            },
            error: function(xhr, status, error) {
                alert("Terjadi kesalahan saat memuat data: " + error);
            }
        });
    });


    // --- 6. EVENT DINAMIS ---
    $("#paketContainer").on("click", ".judul-paket", function() {
        let harga = $(this).data("harga");
        let formatHarga = harga.toLocaleString('id-ID');
        alert("Informasi Harga Paket: Rp " + formatHarga);
    });

    $("#paketContainer").on("click", ".btn-pesan", function() {
        let namaPaket = $(this).data("nama");
        let hargaPerOrang = $(this).data("harga");
        
        let inputJumlah = prompt("Berapa orang yang akan ikut dalam " + namaPaket + "?", "1");

        if (inputJumlah !== null) {
            let jumlah = Number(inputJumlah);
            if (jumlah > 0 && Number.isInteger(jumlah)) {
                let totalFormat = (jumlah * hargaPerOrang).toLocaleString('id-ID');
                alert("Berhasil! Anda memesan " + namaPaket + " untuk " + jumlah + " orang.\nTotal biaya: Rp " + totalFormat);
            } else {
                alert("Jumlah tidak valid! Harap masukkan angka bulat (huruf tidak diperbolehkan).");
            }
        }
    });

});