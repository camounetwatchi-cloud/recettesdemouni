# Script PowerShell pour importer les recettes du cahier rouge dans Firestore
$apiKey = "AIzaSyDGz2VheDvzTg3sz5ckOSMOdokSwhOEQF0"
$baseUrl = "https://firestore.googleapis.com/v1/projects/recettesdemounie/databases/(default)/documents/recipes"

# Lire le fichier JSON
Write-Host "📖 Lecture du fichier recettes-cahierRouge.json..."
$recipes = Get-Content -Path ".\recettes-cahierRouge.json" -Raw | ConvertFrom-Json
Write-Host "✅ $($recipes.Count) recettes trouvées"

Write-Host "`n📝 Import des recettes du cahier rouge..."
$count = 0
$errors = 0

foreach ($recipe in $recipes) {
    try {
        # Convertir les ingrédients en format Firestore
        $ingredientsArray = @()
        foreach ($ing in $recipe.ingredients) {
            $ingredientsArray += @{
                mapValue = @{
                    fields = @{
                        name = @{ stringValue = $ing.name }
                        quantity = @{ stringValue = $ing.quantity }
                    }
                }
            }
        }
        
        # Convertir les étapes en format Firestore
        $stepsArray = @()
        foreach ($step in $recipe.steps) {
            $stepsArray += @{ stringValue = $step }
        }
        
        # Convertir les tips en format Firestore
        $tipsArray = @()
        if ($recipe.tips) {
            foreach ($tip in $recipe.tips) {
                $tipsArray += @{ stringValue = $tip }
            }
        }
        
        # Construire le document Firestore
        $body = @{
            fields = @{
                id = @{ integerValue = $recipe.id.ToString() }
                name = @{ stringValue = $recipe.name }
                ingredients = @{ arrayValue = @{ values = $ingredientsArray } }
                steps = @{ arrayValue = @{ values = $stepsArray } }
                tips = @{ arrayValue = @{ values = $tipsArray } }
                tag = @{ stringValue = if ($recipe.tag) { $recipe.tag } else { "Cahier rouge" } }
                createdAt = @{ stringValue = if ($recipe.createdAt) { $recipe.createdAt } else { (Get-Date).ToString("o") } }
                updatedAt = @{ stringValue = (Get-Date).ToString("o") }
            }
        } | ConvertTo-Json -Depth 10
        
        # Envoyer à Firestore
        $url = "$baseUrl/$($recipe.id)?key=$apiKey"
        $response = Invoke-RestMethod -Uri $url -Method PATCH -Body $body -ContentType "application/json"
        
        $count++
        if ($count % 20 -eq 0) {
            Write-Host "   $count recettes importées..."
        }
    }
    catch {
        $errors++
        Write-Host "❌ Erreur pour $($recipe.name): $_"
    }
}

Write-Host "`n🎉 Import terminé !"
Write-Host "   ✅ $count recettes importées avec succès"
if ($errors -gt 0) {
    Write-Host "   ⚠️ $errors erreurs"
}
