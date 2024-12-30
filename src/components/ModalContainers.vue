<template>
  <div class="modal fade" id="modal-containers" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Selecionar containers</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="input-group mb-3">
            <span class="input-group-text strong">GRUPO:</span>
            <input type="text" class="form-control" placeholder="Nome do grupo" v-model="groupName">
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Container</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in containers" :class="c.selected ? 'table-success' : ''" v-on:click="select(c)">
                <td>{{ c.Names }}</td>
                <td class="text-end">
                  <button class="btn btn-danger" v-if="c.selected">X</button>
                  <button class="btn btn-primary" v-else>V</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
          <button type="button" class="btn btn-success" v-on:click="createGroup">Salvar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'

export default {
  name: 'ModalContainers',
  data() {
    return{
      groupName: "",
      //group: {},
      groups: []
    }
  },
  props: {
    containers: Array
  },
  mounted() {
  },
  methods: {
    createGroup() {
      if( this.groupName.length <= 0 ) {
        Swal.fire({
          icon: "warning",
          title: "Digite um nome para identificar o grupo de containers"
        })
        return
      }

      let selected = []
      for( let i = 0; i < this.containers.length; i++ ) {
        if( this.containers[i].selected ) {
          selected.push(this.containers[i])
        }
      }
      if( selected.length <= 0 ) {
        Swal.fire({
          icon: "warning",
          title: "Selecione pelo menos um container para criar o grupo"
        })
        return
      }

      let current = JSON.parse(localStorage.getItem("groups"))
      if(current == null) {
        current = []
      }
      current.push({
        name: this.groupName,
        containers: selected,
      })

      localStorage.setItem("groups", JSON.stringify(current))
      Swal.fire({
        icon: "success",
        title: "Grupo salvo"
      })

      for( let i = 0; i < this.containers.length; i++ ) {
        this.containers[i].selected = false
      }
    },
    select(container) {
      if( container.selected ) {
        container.selected = false
      } else {
        container.selected = true
      }
    },
  },
}
</script>

<style scoped lang="scss">
</style>
