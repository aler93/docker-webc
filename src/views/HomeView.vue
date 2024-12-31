<template>
  <div id="containers">
    <div class="card">
      <div class="card-footer">
        <button class="btn btn-dark" v-if="list" v-on:click="toggleList">Grupos</button>
        <button class="btn btn-secondary" v-else v-on:click="toggleList">Containers</button>

        <button class="btn btn-primary float-end" v-if="!list" v-on:click="toggleModal" data-bs-toggle="modal" data-bs-target="#modal-containers">
          Criar grupo
        </button>
      </div>
      <table class="table table-hover mb-0" v-if="list">
        <thead>
          <tr class="table-secondary">
            <th>Nome</th>
            <th>Portas</th>
            <th>Criação</th>
            <th>Status</th>
            <th>Imagem</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr class="align-middle" v-for="c in containers">
            <td>{{ c.Names }}</td>
            <td>{{ c.Ports }}</td>
            <td>{{ c.RunningFor }}</td>
            <td>{{ c.Status }}</td>
            <td>{{ c.Image }}</td>
            <td class="text-end d-xxl-none">
              <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Ações
                </button>
                <ul class="dropdown-menu">
                  <li v-if="c.State === 'running'"><a class="dropdown-item">Parar</a></li>
                  <li v-else><a class="dropdown-item">Iniciar</a></li>

                  <li v-if="c.ID !== 'running'"><a class="dropdown-item">Reiniciar</a></li>

                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item">Remover</a></li>
                </ul>
              </div>
            </td>
            <td class="text-end d-none d-xxl-block">
              <button class="btn btn-success mx-1" v-on:click="start(c.ID)" v-if="c.State !== 'running'">
                <i class="material-icons">play_circle</i>
              </button>
              <button class="btn btn-primary mx-1" v-on:click="restart(c.ID)" v-if="c.State !== 'running'">
                <i class="material-icons">replay</i>
              </button>
              <button class="btn btn-danger mx-1" v-on:click="stop(c.ID)" v-if="c.State === 'running'">
                <i class="material-icons">stop_circle</i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="mt-2" v-else>
        <div class="card border border-dark mt-3" v-for="g in groups">
          <div class="card-header bg-dark">
            <h5 class="text-white mb-0"> {{ g.name }} </h5>
          </div>
          <div class="card-body">
            <table class="table">
              <thead>
                <tr>
                  <th>Container</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in g.containers">
                  <td>{{ c.Names }}</td>
                  <td>{{ c.Status }}</td>
                  <td class="text-end d-xxl-none">
                    <div class="dropdown">
                      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Ações
                      </button>
                      <ul class="dropdown-menu">
                        <li v-if="c.State === 'running'"><a class="dropdown-item">Parar</a></li>
                        <li v-else><a class="dropdown-item">Iniciar</a></li>

                        <li v-if="c.ID !== 'running'"><a class="dropdown-item">Reiniciar</a></li>

                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item">Remover</a></li>
                      </ul>
                    </div>
                  </td>
                  <td class="text-end d-none d-xxl-block">
                    <button class="btn btn-success mx-1" v-on:click="start(c.ID)" v-if="c.State !== 'running'">
                      <i class="material-icons">play_circle</i>
                    </button>
                    <button class="btn btn-primary mx-1" v-on:click="restart(c.ID)" v-if="c.State !== 'running'">
                      <i class="material-icons">replay</i>
                    </button>
                    <button class="btn btn-danger mx-1" v-on:click="stop(c.ID)" v-if="c.State === 'running'">
                      <i class="material-icons">stop_circle</i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-footer">
            <button class="btn btn-success mx-1" v-on:click="startGroup(g.name)">
              Iniciar <i class="material-icons">play_circle</i>
            </button>
            <button class="btn btn-primary mx-1"  v-on:click="restartGroup(g.name)">
              Reiniciar <i class="material-icons">replay</i>
            </button>
            <button class="btn btn-danger mx-1"  v-on:click="stopGroup(g.name)">
              Parar <i class="material-icons">stop_circle</i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ModalContainers :containers="containers"></ModalContainers>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import ModalContainers from '@/components/ModalContainers.vue'
import axios from "axios"
import Swal from 'sweetalert2'

export default {
  name: 'HomeView',
  components: {
    ModalContainers,
  },
  data() {
    return {
      containers: [],
      groups: [],
      api: "http://localhost:4201",
      list: true,
      getUpdate: false,
    }
  },
  unmounted() {
    this.getUpdate = false
  },
  beforeMount() {
    if( localStorage.getItem("dockercli_list") === "1" ) {
      this.list = true
    } else {
      localStorage.setItem("dockercli_list", "0")
      this.list = false
    }

    let groups = JSON.parse(localStorage.getItem("dockercli_groups"))
    if( groups ) {
      this.groups = groups
    }
    this.getUpdate = true
  },
  mounted() {
    //console.log("HomeView")
    this.ps()

    setInterval( () => {
      if( this.getUpdate ) {
        this.ps()
      }
    }, 2500 )

    const modalGrp = document.getElementById('modal-containers')
    modalGrp.addEventListener('hidden.bs.modal', (event) => {
      this.toggleModal()
    })
  },
  methods: {
    toggleList() {
      this.list = !this.list
      if( this.list ) {
        localStorage.setItem("dockercli_list", "1")
      } else {
        localStorage.setItem("dockercli_list", "0")
      }
    },
    ps() {
      axios.get(this.api + "/ps").then( (r) => {
        this.containers = r.data.result

        for(let i = 0; i < this.groups.length; i++) {
          for(let j = 0; j < this.groups[i].containers.length; j++) {
            for(let k = 0; k < this.containers.length; k++)
            if(this.groups[i].containers[j].ID === this.containers[k].ID) {
              this.groups[i].containers[j] = this.containers[k]
            }
          }
        }
      })
    },
    start(id) {
      axios.get(this.api + "/start?id=" + id).then( (r) => {
        this.displayResponse(r.data.command)
      })
    },
    startGroup(grp) {
      let ids = ""
      for(let i = 0; i < this.groups.length; i++) {
        if( this.groups[i].name === grp ) {
          for(let j = 0; j < this.groups[i].containers.length; j++) {
            ids += this.groups[i].containers[j].ID + " "

            this.start(this.groups[i].containers[j].ID)
          }
        }
      }

      //this.start(ids)
    },
    stop(id) {
      axios.get(this.api + "/stop?id=" + id).then( (r) => {
        this.displayResponse(r.data.command)
      })
    },
    stopGroup(grp) {
      let ids = ""
      for(let i = 0; i < this.groups.length; i++) {
        if( this.groups[i].name === grp ) {
          for(let j = 0; j < this.groups[i].containers.length; j++) {
            ids += this.groups[i].containers[j].ID + " "

            this.stop(this.groups[i].containers[j].ID)
          }
        }
      }

      //this.stop(ids)
    },
    restart(id) {
      axios.get(this.api + "/restart?id=" + id).then( (r) => {
        this.displayResponse(r.data.command)
      })
    },
    restartGroup(grp) {
      console.log(grp)
    },
    volume() {},
    network() {},
    displayResponse(resp) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      })
      Toast.fire({
        icon: "info",
        title: resp
      })
    },
    toggleModal() {
      this.getUpdate = !this.getUpdate
    },
  },
}
</script>
