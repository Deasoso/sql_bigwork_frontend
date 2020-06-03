<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div style="margin: 15px;">
      <el-input placeholder="搜索" v-model="searchinput" class="input-with-select">
        <el-select v-model="searchselect" slot="prepend" placeholder="请选择">
          <el-option label="书名" value="1"></el-option>
          <el-option label="用户" value="2"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="Clicktab">
      <el-tab-pane label="所有" name="all"></el-tab-pane>
      <el-tab-pane label="在架" name="no"></el-tab-pane>
      <el-tab-pane label="已租出" name="yes"></el-tab-pane>
      <el-tab-pane label="已卖出" name="cancel"></el-tab-pane>
    </el-tabs>
    <div class="table_container">
      <el-table
        :data="showtableData"
        :row-key="row => row.id"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="地区">
                  {{props.row.area}}
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="编号"
          prop="id">
        </el-table-column>
        <el-table-column
          label="书名"
          prop="name">
        </el-table-column>
        <el-table-column
          label="介绍"
          prop="introduce">
        </el-table-column>
        <el-table-column
          label="价格"
          prop="value">
        </el-table-column>
        <el-table-column
          label="备注"
          prop="remark">
        </el-table-column>
        <el-table-column
          label="状态"
          prop="remark">
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="agreereview(scope.row.onlyid)">通过</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";
export default {
  data() {
    return {
      activeName: "all",
      tableData: [],
      showtableData: [],
      headertoken: "",
      searchselect: '',
      searchinput: '',
    };
  },
  created() {},
  computed: {},
  components: {
    headTop
  },
  methods: {
    Clicktab(e) {
      this.activeName = e.name;
      console.log(e.name);
      if (e.name == "all") {
        this.showtableData = this.tableData;
      } else if (e.name == "no") {
        this.showtableData = this.tableData.filter(item => item.reviewed === 1);
      } else if (e.name == "yes") {
        this.showtableData = this.tableData.filter(item => item.reviewed === 2);
      } else if (e.name == "cancel") {
        this.showtableData = this.tableData.filter(item => item.reviewed === 3);
      }
    },
    async initData() {
      await this.getReviews();
      this.Clicktab({ name: this.activeName });
    },
    async getReviews() {
      const _this = this;
    },
    async agreereview(inputonlyid) {

    },
    async cancelreview(inputonlyid) {

    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.table_container {
  padding: 20px;
}
.Pagination {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
}
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
