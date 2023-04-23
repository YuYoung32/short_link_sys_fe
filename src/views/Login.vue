<script setup>
/**
 * Created by YuYoung on 2023/4/21
 * Description: Login
 */

import { ref, watch } from 'vue';
import axios from '@/service/net';
import { useRouter } from 'vue-router';
import { expireKey, tokenKey } from '@/service/auth';

const router = useRouter();
const password = ref('');
const isValidInput = ref(true);
const badAuth = ref(false);

watch(password, (value) => {
    if (value.length > 0) {
        // 重新开始输入, 取消错误提示
        isValidInput.value = true;
        badAuth.value = false;
    }
});
function login() {
    if (password.value.length === 0) {
        isValidInput.value = false;
        return;
    }
    axios
        .get(`/auth/login?password=${password.value}`)
        .then((response) => {
            if (response.status === 200) {
                // token存储到localStorage
                localStorage.setItem(tokenKey, response.data.token);
                localStorage.setItem(expireKey, response.data.expire);
                router.push('/');
            } else {
                throw '';
            }
        })
        .catch(() => {
            badAuth.value = true;
        });
}
</script>

<template>
    <div
        class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"
    >
        <div class="flex flex-column align-items-center justify-content-center">
            <div
                style="
                    border-radius: 56px;
                    padding: 0.3rem;
                    background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%);
                "
            >
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="">
                            <span class="text-blue-600 text-3xl font-semibold">r</span>
                            <span class="text-900 text-3xl">e</span>
                            <span class="text-blue-600 text-3xl font-semibold">d</span>
                            <span class="text-900 text-3xl">irec</span>
                            <span class="text-blue-600 text-3xl font-semibold">t</span>
                            <span>&nbsp;&nbsp;&nbsp;</span>
                            <span class="text-blue-600 text-3xl font-semibold">w</span>
                            <span class="text-900 text-3xl">eb</span>
                            <span class="text-blue-600 text-3xl font-semibold">s</span>
                            <span class="text-900 text-3xl">ite</span>
                        </div>
                        <div class="text-blue-600 text-xl font-medium mb-3">rdtws.me</div>
                        <div class="text-blue-600 text-xl font-semibold mb-6">短链接转发服务管理平台</div>
                    </div>

                    <div class="md:w-25rem">
                        <InputText
                            type="password"
                            placeholder="请输入口令"
                            v-model.trim="password"
                            :toggleMask="true"
                            class="w-full mb-3"
                            inputClass="w-full"
                            inputStyle="padding:1rem"
                            :class="{ 'p-invalid': badAuth || !isValidInput }"
                        ></InputText>

                        <Button label="登陆" class="w-full text-xl" @click="login"></Button>
                        <div v-if="badAuth" class="text-red-600 text-xl font-semibold mt-3 -mb-4 text-center">
                            口令错误
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
