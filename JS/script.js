$(function() {

    if ($("body").hasClass("page-beranda")) {
        let n = sessionStorage.getItem("namaPengunjung") || prompt("Halo! Siapa nama Anda?", "Petualang");
        if (n && n.trim()) {
            sessionStorage.setItem("namaPengunjung", n);
            $("main h2").text(`Selamat Datang di Portal Eksplorasi, ${n}!`);
        }
    }

    const cek = (id, errCond, msg) => {
        errCond ? $(`#${id}`).addClass("error") : $(`#${id}`).removeClass("error");
        $(`#${id}Error`).text(errCond ? msg : "");
        return !errCond;
    };

    $("#formKontak").submit(function(e) {
        e.preventDefault();
        let [n, m, p] = [$('#nama').val().trim(), $('#email').val().trim(), $('#pesan').val().trim()];
        
        let v1 = cek('nama', n==="", "Nama tidak boleh kosong") && cek('nama', n.length<4, "Minimal 4 karakter");
        let v2 = cek('email', m==="", "Email tidak boleh kosong") && cek('email', !/^\S+@\S+\.\S+$/.test(m), "Format email salah");
        let v3 = cek('pesan', p==="", "Pesan tidak boleh kosong");
        
        if (v1 && v2 && v3) {
            $("#hasilForm").html(`<p style='color:#27ae60;font-weight:bold'>Terima kasih, ${n}! Pesan diterima.</p>`);
            this.reset();
        }
    });

    $("#formLogin").submit(function(e) {
        e.preventDefault();
        let [u, p] = [$('#username').val().trim(), $('#password').val().trim()];
        
        let v1 = cek('username', u==="", "Username tidak boleh kosong");
        let v2 = cek('password', p==="", "Password tidak boleh kosong") && cek('password', p.length<6, "Min 6 karakter") && cek('password', p.length>16, "Max 16 karakter");
        
        if (v1 && v2) {
            $("#hasilForm").html(`<p style='color:#27ae60;font-weight:bold'>Selamat datang kembali, ${u}!</p>`);
            this.reset();
        }
    });

    $("#btn-muat-paket").click(function() {
        $.getJSON("paket.json", d => {
            $("#paketContainer").html(d.map(p => `
                <article class="paket-card">
                    <h3 class="judul-paket" style="color:#d4af37;cursor:pointer" data-harga="${p.harga}">${p.nama}</h3>
                    <div class="price">Rp ${p.harga.toLocaleString('id-ID')} <span>/ ORANG</span></div>
                    <p>${p.deskripsi}</p><hr>
                    ${p.fasilitas?.length ? `<h4 style="color:#d4af37;text-align:left;margin-bottom:15px;">Fasilitas Paket:</h4><ul>${p.fasilitas.map(f=>`<li>${f}</li>`).join('')}</ul>` : ""}
                    ${p.itinerary?.length ? `<h4 style="color:#d4af37;text-align:left;margin-bottom:15px;">Itinerary Singkat:</h4><ol>${p.itinerary.map(i=>`<li>${i}</li>`).join('')}</ol>` : ""}
                    <button class="btn-pesan" data-nama="${p.nama}" data-harga="${p.harga}">Pesan Sekarang</button>
                </article>`).join(''));
            $(this).hide();
        }).fail(() => alert("Terjadi kesalahan saat memuat data!"));
    });

    $("#paketContainer")
        .on("click", ".judul-paket", function() {
            alert(`Informasi Harga Paket: Rp ${$(this).data("harga").toLocaleString('id-ID')}`);
        })
        .on("click", ".btn-pesan", function() {
            let $t = $(this), n = $t.data("nama"), h = $t.data("harga"), i = prompt(`Berapa orang yang akan ikut dalam ${n}?`, "1");
            if (i !== null) {
                let j = Number(i);
                
                Number.isInteger(j) && j > 0 
                    ? alert(`Berhasil! Anda memesan ${n} untuk ${j} orang.\nTotal biaya: Rp ${(j * h).toLocaleString('id-ID')}`) 
                    : alert("Jumlah tidak valid! Harap hanya masukkan angka bulat (huruf tidak diperbolehkan).");
            }
        });
});