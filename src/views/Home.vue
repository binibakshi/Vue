<template>
  <div>
    <h1 >אהלן</h1>
    <p>זה יהיה דף הבית</p>
    <p>ביינתים ...</p>

    <form enctype="multipart/form-data">
      <input type="file" @change="onFileChange" />
    </form>
    <select>
  <option>1</option>
  <option>2</option>
  <option>3</option>
</select>
  </div>
</template>

<script>
// import employeesTable from '../components/employees-table.vue';
// import toolBar from '../components/tool-bar.vue';

export default {
  name: "Home",
  components: {
    // employeesTable,
    // toolBar
  },
  data() {
    return {
      disableButton: false,
      rows: [
        { name: "James Bond", job: "spy" },
        { name: "Goldfinger", job: "villain" },
      ],
    };
  },
  methods: {
    addRow() {
      this.rows.push({ name: "", job: "" });
    },
    removeRow(index) {
      if (index === 0) {
        return;
      }
      this.rows.splice(index);
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createInput(files[0]);
    },
    createInput(file) {
      let promise = new Promise((resolve) => {
        var reader = new FileReader();
        var vm = this;
        reader.onload = e => {
          resolve((vm.fileinput = reader.result));
          console.log(e)
        };
        reader.readAsText(file);
      });

      promise.then(
        result => {
          /* handle a successful result */
          console.log(this.fileinput);
          console.log(result)
        },
        error => {
          /* handle an error */ 
          console.log(error);
        }
      );
    
    }
  },
};
</script>

<style scoped>

input {
  border: 1px solid;
}
</style>
