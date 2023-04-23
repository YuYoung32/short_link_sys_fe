<script setup>
/**
 * Created by YuYoung on 2023/3/23
 * Description: 用户设置
 */

import { ref, watch } from 'vue';
import axios from '@/service/net';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const isBlank = ref(false);
const isNotRepeat = ref(false);
const oldPassword = ref('');
const newPassword1 = ref('');
const newPassword2 = ref('');

function confirm() {
    if (newPassword1.value.length === 0 || newPassword2.value.length === 0 || oldPassword.value.length === 0) {
        isBlank.value = true;
        return;
    }
    if (newPassword1.value !== newPassword2.value) {
        isNotRepeat.value = true;
        return;
    }
    axios
        .post('/auth/modify', {
            oldPassword: oldPassword.value,
            newPassword: newPassword1.value
        })
        .then(() => {
            toast.add({
                severity: 'success',
                summary: '成功',
                detail: '修改成功',
                life: 3000
            });
        })
        .catch(() => {
            toast.add({
                severity: 'error',
                summary: '失败',
                detail: '修改失败',
                life: 3000
            });
        });
}

watch([newPassword1, newPassword2, oldPassword], ([newPassword1, newPassword2, oldPassword]) => {
    if (newPassword1.length > 0 || newPassword2.length > 0 || oldPassword.length > 0) {
        isBlank.value = false;
        isNotRepeat.value = false;
    }
});
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <h5>修改口令</h5>
                <div class="p-fluid lg:px-8 py-3" style="max-width: 100%">
                    <InputText
                        type="password"
                        :toggleMask="true"
                        placeholder="请输入原口令"
                        v-model.trim="oldPassword"
                        class="w-full mb-3"
                        inputClass="w-full"
                        inputStyle="padding:1rem"
                        :class="{ 'p-invalid': isBlank }"
                    ></InputText>
                    <InputText
                        type="password"
                        placeholder="请输入新口令"
                        v-model.trim="newPassword1"
                        class="w-full mb-3"
                        inputClass="w-full"
                        inputStyle="padding:1rem"
                        :class="{ 'p-invalid': isBlank || isNotRepeat }"
                    ></InputText>
                    <InputText
                        type="password"
                        placeholder="再次输入新口令"
                        v-model.trim="newPassword2"
                        class="w-full mb-3"
                        inputClass="w-full"
                        inputStyle="padding:1rem"
                        :class="{ 'p-invalid': isBlank || isNotRepeat }"
                    ></InputText>

                    <Button label="确定" class="w-full text-xl" @click="confirm"></Button>
                </div>
            </div>
        </div>
    </div>
</template>
