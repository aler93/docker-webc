<template>
  <div id="containers">
    <div class="card">
      <div class="card-footer">
        <button class="btn btn-primary" v-if="list" v-on:click="toggleList">Containers</button>
        <button class="btn btn-dark" v-else v-on:click="toggleList">Grupos</button>

        <button class="btn btn-primary float-end" v-if="!list" data-bs-toggle="modal" data-bs-target="#modal-containers">Criar grupo</button>
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
            <td>{{c[1]}}</td>
            <td>{{c[6]}}</td>
            <td>{{c[4]}}</td>
            <td>{{c[5]}}</td>
            <td>{{c[2]}}</td>
            <td class="text-end">
              <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Ações
                </button>
                <ul class="dropdown-menu">
                  <li v-if="c[7]"><a class="dropdown-item">Parar</a></li>
                  <li v-else><a class="dropdown-item">Iniciar</a></li>

                  <li v-if="c[7]"><a class="dropdown-item">Reiniciar</a></li>

                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item">Remover</a></li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="mt-2" v-else>
        <div class="card border border-dark mb-3" v-for="g in groups">
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
                  <td>{{ c[1] }}</td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
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
    }
  },
  beforeMount() {
    if( localStorage.getItem("list") === "1" ) {
      this.list = true
    } else {
      localStorage.setItem("list", "0")
      this.list = false
    }

    let groups = JSON.parse(localStorage.getItem("groups"))
    if( groups ) {
      this.groups = groups
    }
  },
  mounted() {
    //console.log("HomeView")
    this.ps()
  },
  methods: {
    toggleList() {
      this.list = !this.list
      if( this.list ) {
        localStorage.setItem("list", "1")
      } else {
        localStorage.setItem("list", "0")
      }
    },
    ps() {
      axios.get(this.api + "/docker-ps").then( (r) => {
        let cont = r.data
        for( let i = 0; i < cont.length; i++ ) {
          if(cont[i][5].includes("Up")) {
            cont[i][7] = true
          } else {
            cont[i][7] = false
          }
        }

        this.containers = cont
      })
    },
    start(id) {},
    stop(id) {},
    restart(id) {},
    volume() {},
    network() {},
  },
}
</script>
