<template>
    <div class="fillcontain">
        <head-top></head-top>
        <el-input v-model="headertoken" placeholder="请输入header">
        </el-input>
        <el-button type="primary" @click="initData">获取订单信息</el-button>
        <el-tabs v-model="activeName" type="card" @tab-click="Clicktab">
            <el-tab-pane label="全部已支付订单" name="all"></el-tab-pane>
            <el-tab-pane label="正在授课" name="teaching"></el-tab-pane>
            <el-tab-pane label="已授课完毕" name="teached"></el-tab-pane>
        </el-tabs>
        <!-- 显示订单表格 -->
        <div class="table_container" v-show="activeName!='tea'">
            <el-table
                v-if="tableupdate"
                :data="showtableData"
                ref="ordtable"
                :row-key="row => row.index"
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="上课时间">
                            <div v-for="item,index in props.row.lessondays" :key="index">
                                {{props.row.lessondays[index]}}
                                {{props.row.lessontime[index]}}
                                <el-button
                                    size="small"
                                    type="danger"
                                    @click="deletedate(props.row, props.row.lessondays[index])">
                                    删除
                                </el-button>
                            </div>
                            <el-input v-model="addday" class="inputlength" placeholder="输入增加日期"></el-input>
                            <el-input v-model="addtime" class="inputlength" placeholder="输入增加时间"></el-input>
                            <el-button
                                size="small"
                                type="success"
                                @click="adddate(props.row)">
                                添加
                            </el-button>
                            <el-button
                                size="small"
                                type="info"
                                @click="setdate(props.row)">
                                确认
                            </el-button>
                            <!-- <span>{{ props.row.picurls.idarr[0] }}</span> -->
                        </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  label="科目"
                  prop="subject">
                </el-table-column>
                <el-table-column
                  label="教师姓"
                  prop="teacher.firstname">
                </el-table-column>
                <el-table-column
                  label="教师名"
                  prop="teacher.lastname">
                </el-table-column>
                <el-table-column
                  label="孩子简介"
                  prop="kid">
                </el-table-column>
                <el-table-column
                  label="已上课时"
                  prop="teachtimes">
                </el-table-column>
                <el-table-column
                  label="总课时"
                  prop="times">
                </el-table-column>
                <el-table-column
                  label="课时不足"
                  prop="noenough">
                </el-table-column>
                <el-table-column
                  label="总价"
                  prop="value">
                </el-table-column>
                <el-table-column label="操作" width="160">
                  <template slot-scope="scope">
                    <el-button
                        :ref="'match' + scope.row.id" 
                        size="small"
                        type="success"
                        @click="orderunlock(scope.row.id)"
                        v-show="scope.row.teachtimes < scope.row.times">
                        推进教学进度
                    </el-button>
                  </template>
                </el-table-column>
            </el-table>
            <!-- <div class="Pagination">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="20"
                  layout="total, prev, pager, next"
                  :total="count">
                </el-pagination>
            </div> -->
        </div>
    </div>
</template>

<script>
    const axios = require('axios');
    import headTop from '../components/headTop'
    import { SIGUSR1 } from 'constants';
    export default {
        data(){
            return {
                activeName: 'all',
                offset: 0,
                limit: 20,
                count: 1,
                tableData: [],
                showtableData: [],
                currentPage: 1,
                teacurrentPage: 1,
                headertoken: "",
                matcharr: [],
                addday: '',
                addtime: '',
                tableupdate: true,
                markvalue: 0,
            }
        },
        created(){
        },
        computed: {
        },
    	components: {
    		headTop,
    	},
        methods: {
            Clicktab(e){
                this.activeName = e.name;
                if(e.name == "all"){
                    this.showtableData = this.tableData.filter(item => item.payed == 1 && item.reviewed == 1);
                    this.$refs.ordtable.data = this.showtableData;
                }else if(e.name == "teaching"){
                    this.showtableData = this.tableData.filter(item => item.payed == 1 && item.reviewed == 1 && item.teachtimes < item.times);
                    this.$refs.ordtable.data = this.showtableData;
                }else if(e.name == "teached"){
                    this.showtableData = this.tableData.filter(item => item.payed == 1 && item.reviewed == 1 && item.teachtimes >= item.times);
                    this.$refs.ordtable.data = this.showtableData;
                }
            },
            async initData(){
                this.getFoods();
            },
            async getMenu(){
                console.log('获取食品种类失败', err);
            },
            async getFoods(){
                this.tableData = [];
                const response = await axios.get(`https://api.deaso40.com/api/getallorders`, {
                    data: {}, 
                    headers: {
                        'token': this.headertoken
                    }
                })
                console.log(response);
                const data = response.data;
                if(data.statusCode != 200){
                    this.$message(data.message);
                }else{
                    this.tableData = response.data.result;
                    this.showtableData = this.tableData;
                }
                this.Clicktab({name: this.activeName});
            },
            async orderunlock(inputid){
                const sure = await new Promise((resolve, reject) => {
                    this.$msgbox({
                        title: '提示',
                        message: '确认推进吗？',
                        showCancelButton: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        beforeClose: (action, instance, done) => {
                            if (action === 'confirm') {
                                done()
                                resolve(true)
                            } else {
                                done()
                                resolve(false)
                            }
                        }
                    })
                })
                if(!sure) return;
                const response = await axios.post(`https://api.deaso40.com/api/orderunlock`, 
                    {   
                        orderid: inputid, 
                    }, {
                        headers: {
                            'token': this.headertoken
                        }
                    }
                );
                const data = response.data;
                console.log(data);
                if(data.statusCode != 200){
                    this.$message(data.message);
                }else{
                    this.$message("成功");
                }
                await this.initData();
                this.Clicktab({name: this.activeName});
            },
            tableRowClassName(row, index) {
		        if (index === 1) {
		        	return 'info-row';
		        } else if (index === 3) {
		        	return 'positive-row';
		        }
		        return '';
		    },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1)*this.limit;
                this.getFoods()
            },
            removeByValue(arr, val) {
                for(var i = 0; i < arr.length; i++) {
                    if(arr[i] == val) {
                        arr.splice(i, 1);
                        i--;
                    }
                }
            },
            adddate(order){
                console.log(this.addday + ' ' + this.addtime)
                order.lessondays.push(this.addday);
                order.lessontime.push(this.addtime);
            },
            deletedate(order, inputindex){
                console.log(inputindex)
                function removeByValue(arr1, arr2, val) {
                // 删除方法，由于lessondays和tilecontent对齐，可以一起删
                    for (let i = 0; i < arr1.length; i += 1) {
                        if (arr1[i] === val) {
                            arr1.splice(i, 1);
                            arr2.splice(i, 1);
                            i -= 1;
                        }
                    }
                }
                removeByValue(order.lessondays, order.lessontime, inputindex);
            },
            async setdate(order){
                const response = await axios.post(`https://api.deaso40.com/api/setlessondays`, 
                    {   
                        orderid: order.id,
                        lessondays: order.lessondays,
                        lessontime: order.lessontime,
                    }, {
                        headers: {
                            'token': this.headertoken
                        }
                    }
                );
                const data = response.data;
                console.log(data);
                if(data.statusCode != 200){
                    this.$message(data.message);
                }else{
                    this.$message("成功");
                }
            }
        },
    }
</script>

<style lang="less">
	@import '../style/mixin';
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
    .table_container{
        padding: 20px;
    }
    .Pagination{
        display: flex;
        justify-content: flex-start;
        margin-top: 8px;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }
    .avatar {
        width: 120px;
        height: 120px;
        display: block;
    }
    .inputlength{
        width: 150px;
    }
</style>
