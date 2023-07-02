window.addEventListener("DOMContentLoaded", (event) => {
  // Toggle the side navigation
  const sidebarToggle = document.body.querySelector("#sidebarToggle");
  if (sidebarToggle) {
    // Uncomment Below to persist sidebar toggle between refreshes
    // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
    //     document.body.classList.toggle('sb-sidenav-toggled');
    // }
    sidebarToggle.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.toggle("sb-sidenav-toggled");
      localStorage.setItem(
        "sb|sidebar-toggle",
        document.body.classList.contains("sb-sidenav-toggled")
      );
    });
  }
});

// Funcion donde se grafica los datos del API Weather
let plot = (data) => {
  //grafico lineal
  const ctx = document.getElementById("myChart");
  const dataset = {
    labels: data.hourly.time,
    datasets: [
      {
        label: "Temperatura por hora semanal",
        data: data.hourly.temperature_2m,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };
  const config = {
    type: "line",
    data: dataset,
  };
  const chart = new Chart(ctx, config);

  // grafico de barras
  const ctx_2 = document.getElementById("myChart_uv");
  const data_2 = {
    labels: data.daily.time,
    datasets: [
      {
        label: "UV index Diario",
        data: data.daily.uv_index_max,
        backgroundColor: [
          "rgba(255, 99, 132)",
          "rgba(255, 159, 64)",
          "rgba(255, 205, 86)",
          "rgba(75, 192, 192)",
          "rgba(54, 162, 235)",
          "rgba(153, 102, 255)",
          "rgba(201, 203, 207)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const config_2 = {
    type: "bar",
    data: data_2,
    options: {
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
            gridLines: {
              display: true,
            },
          },
        ],
      },
      legend: {
        display: false,
      },
    },
  };

  const chart_uv = new Chart(ctx_2, config_2);

  // grafico de area
  const ctx_3 = document.getElementById("myChart_wind");
  const dataset_3 = {
    labels: data.daily.time,
    datasets: [
      {
        label: "Wind Speed MAX",
        data: data.daily.windspeed_10m_max,
        fill: "origin",
        borderColor: "#466fb0",
        backgroundColor: "rgba(172, 204, 236, 0.2)",
        borderWidth: 1,
      },
    ],
  };

  const config_3 = {
    type: "line",
    data: dataset_3,
    options: {
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
            },
          },
        ],
      },
    },
  };
  const myChart_w = new Chart(ctx_3, config_3);

  // grafico de barras - comparacion
  const ctx_4 = document.getElementById("myChart_min-max");
  const data_4 = {
    labels: data.daily.time,
    datasets: [
      {
        label: "Temperatura min",
        data: data.daily.temperature_2m_min,
        backgroundColor: "#7da3e8",
        borderWidth: 1,
        stack: "stack0",
      },
      {
        label: "Temperatura max",
        data: data.daily.temperature_2m_max,
        backgroundColor: "#c45858",
        borderWidth: 1,
        stack: "stack0",
      },
    ],
  };

  const config_4 = {
    type: "bar",
    data: data_4,
    options: {
      responsive: true,
      interaction: {
        intersect: false,
      },
      scales: {
        xAxes: {
          stacked: true,
        },
        yAxes: {
          stacked: true,
        },
      },
    },
  };

  const chart_minmax = new Chart(ctx_4, config_4);
};

let load = (data) => {
  let timezone = data.timezone;
  let tzone = document.getElementById("timezone");
  tzone.textContent = timezone;

  let latitude = data.latitude;
  let lati = document.getElementById("latitud");
  lati.textContent = latitude;

  let longitude = data.longitude;
  let longi = document.getElementById("longitud");
  longi.textContent = longitude;

  let elevation = data["elevation"];
  let elev = document.getElementById("elevacion");
  elev.textContent = elevation;

  plot(data);
};

// Fetch del API de mareas del Ecuador
let loadInocar = () => {
  let URL =
    "https://cors-anywhere.herokuapp.com/https://www.inocar.mil.ec/mareas/consultan.php";
  fetch(URL)
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "text/html");
      let contenedorMareas = xml.getElementsByClassName("container-fluid")[0];
      let contenedorHTML = document.getElementById("table-container");
      contenedorHTML.innerHTML = contenedorMareas.innerHTML;
    })
    .catch(console.error);
};

// Funcion Autoejecutable :
// ~fetch del API weather
// ~llama a las demas funciones
(function () {
  let meteo = localStorage.getItem("meteo");
  if (meteo == null) {
    let URL =
      "https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,uv_index_max,windspeed_10m_max&timezone=auto";
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        load(data);
        localStorage.setItem("meteo", JSON.stringify(data));
      })
      .catch(console.error);
  } else {
    console.log("pasa por aqui");
    load(JSON.parse(meteo));
  }
  loadInocar();
})();
