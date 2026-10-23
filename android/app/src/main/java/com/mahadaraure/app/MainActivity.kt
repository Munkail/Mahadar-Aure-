package com.mahadaraure.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.compose.*
import com.mahadaraure.app.data.model.*

val BrandNavy = Color(0xFF0F172A)
val BrandHotPink = Color(0xFFEC4899)
val BrandLightBg = Color(0xFFF8FAFC)
val BrandSurface = Color(0xFF1E293B)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MahadarAureTheme {
                MahadarAppRoot()
            }
        }
    }
}

@Composable
fun MahadarAureTheme(content: @Composable () -> Unit) {
    val colorScheme = darkColorScheme(
        primary = BrandHotPink,
        secondary = Color(0xFF38BDF8),
        background = BrandNavy,
        surface = BrandSurface,
        onPrimary = Color.White,
        onBackground = Color.White,
        onSurface = Color.White
    )
    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MahadarAppRoot() {
    val navController = rememberNavController()
    var currentLanguage by remember { mutableStateOf("ha") } // "ha" or "en"
    var selectedTab by remember { mutableIntStateOf(0) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Mahadar Aure",
                            style = MaterialTheme.typography.titleMedium,
                            color = Color.White
                        )
                        Text(
                            text = if (currentLanguage == "ha") "Haɗa Zuciya, Gina Gida" else "Connecting Hearts, Building Homes",
                            style = MaterialTheme.typography.labelSmall,
                            color = BrandHotPink
                        )
                    }
                },
                actions = {
                    TextButton(onClick = { currentLanguage = if (currentLanguage == "ha") "en" else "ha" }) {
                        Text(
                            text = if (currentLanguage == "ha") "EN" else "HA",
                            color = Color.White
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = BrandNavy
                )
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = BrandSurface
            ) {
                val items = listOf(
                    Triple("Dandali", "Dashboard", Icons.Default.Dashboard),
                    Triple("Rijista", "Register", Icons.Default.PersonAdd),
                    Triple("Sakatariya", "AI Secretary", Icons.Default.Chat),
                    Triple("Sasanta", "Matchmaking", Icons.Default.Favorite),
                    Triple("Biyan Kuɗi", "Payments", Icons.Default.Payment)
                )

                items.forEachIndexed { index, (labelHa, labelEn, icon) ->
                    NavigationBarItem(
                        selected = selectedTab == index,
                        onClick = { selectedTab = index },
                        icon = { Icon(icon, contentDescription = labelEn) },
                        label = {
                            Text(
                                text = if (currentLanguage == "ha") labelHa else labelEn,
                                style = MaterialTheme.typography.labelSmall
                            )
                        },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = BrandHotPink,
                            selectedTextColor = BrandHotPink,
                            indicatorColor = BrandNavy
                        )
                    )
                }
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(BrandNavy)
        ) {
            when (selectedTab) {
                0 -> AndroidDashboardView(currentLanguage)
                1 -> AndroidRegistrationView(currentLanguage)
                2 -> AndroidAiSecretaryView(currentLanguage)
                3 -> AndroidMatchmakingView(currentLanguage)
                4 -> AndroidPaymentView(currentLanguage)
            }
        }
    }
}

@Composable
fun AndroidDashboardView(lang: String) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = if (lang == "ha") "Kula da Ayyukan Mahadar Aure" else "Mahadar Aure Overview",
            style = MaterialTheme.typography.titleLarge,
            color = Color.White
        )
        Spacer(modifier = Modifier.height(16.dp))

        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = BrandSurface)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = if (lang == "ha") "Jimillar Membobi" else "Total Registered Members",
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color.LightGray
                )
                Text(
                    text = "5 Membobi (100% Tantance)",
                    style = MaterialTheme.typography.headlineMedium,
                    color = BrandHotPink
                )
            }
        }
    }
}

@Composable
fun AndroidRegistrationView(lang: String) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = if (lang == "ha") "Rijistar Sabon Memba" else "Member Registration",
            style = MaterialTheme.typography.titleLarge,
            color = Color.White
        )
        Text(
            text = if (lang == "ha") "Shekaru 18+ kadai, bisa amincewa da ka'idojin Musulunci" else "Consenting adults 18+ only under Islamic guidelines",
            style = MaterialTheme.typography.bodySmall,
            color = Color.LightGray
        )
    }
}

@Composable
fun AndroidAiSecretaryView(lang: String) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = if (lang == "ha") "Sakatariyar AI ta Mahadar Aure" else "Mahadar Aure AI Secretary",
            style = MaterialTheme.typography.titleLarge,
            color = Color.White
        )
        Text(
            text = if (lang == "ha") "Amsa tambayoyi kan farashi, tsarin aiki, da dokoki" else "Instant guidance on fees, matchmaking, and rules",
            style = MaterialTheme.typography.bodySmall,
            color = Color.LightGray
        )
    }
}

@Composable
fun AndroidMatchmakingView(lang: String) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = if (lang == "ha") "Sasanta Aure & Daidaituwa" else "Matchmaking Review",
            style = MaterialTheme.typography.titleLarge,
            color = Color.White
        )
    }
}

@Composable
fun AndroidPaymentView(lang: String) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = if (lang == "ha") "Rikodin Biyan Kuɗi (₦ Naira)" else "Payment Verification (₦ NGN)",
            style = MaterialTheme.typography.titleLarge,
            color = Color.White
        )
    }
}
